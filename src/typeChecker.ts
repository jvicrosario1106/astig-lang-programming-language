/**
 * Static type checker for AstigLang.
 *
 * Walks the AST before interpretation and validates declarations, assignments,
 * operators, control-flow conditions, function calls/returns, record literals,
 * and member access. Throws `TypeCheckError` on any mismatch.
 */
import { buildRecordRegistry, RecordRegistry } from './classes/RecordRegistry';
import { TypeCheckError } from './classes/TypeCheckError';
import { TypeEnvironment } from './classes/TypeEnvironment';
import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import { AstigType } from './models/AstigType';
import { ProgramNode } from './models/ProgramNode';
import { ResolvedType } from './models/ResolvedType';
import {
  AssignmentNode,
  AssignmentTarget,
  FunctionDeclarationNode,
  StatementNode,
  StatementNodeType,
  VariableDeclarationNode,
} from './models/StatementNode';
import {
  formatResolvedType,
  isAssignableType,
  isNumericType,
  resolveDataType,
} from './utils/astigTypeUtils';
import {
  findFunctionInModules,
  withModuleFunctions,
} from './utils/moduleScope';

/** Type-checks an entry program (merged functions/records, then entry `main` only). */
export function typeCheckProgram(program: ProgramNode): void {
  const recordRegistry = buildRecordRegistry(program.recordDeclarations);
  const globalEnvironment = new TypeEnvironment(undefined, true);

  // Register only cross-file visible functions (exported + entry-file).
  for (const functionNode of program.functions) {
    globalEnvironment.declareFunction(functionNode);
  }

  // Type-check every function using its file scope so private helpers resolve.
  for (const moduleFunctions of Object.values(program.moduleFunctions)) {
    for (const functionNode of moduleFunctions) {
      const callableEnvironment = withModuleFunctions(
        globalEnvironment,
        functionNode.sourceModule,
        program.moduleFunctions,
      );
      checkFunctionDeclaration(functionNode, callableEnvironment, recordRegistry, program);
    }
  }

  if (!program.mainFunction) {
    throw new TypeCheckError('Entry program file must define function main()');
  }

  // `main` sees exported functions plus all functions from the entry file.
  const mainEnvironment = withModuleFunctions(
    globalEnvironment,
    program.entryModule,
    program.moduleFunctions,
  );
  
  checkBlock(program.mainFunction.body, mainEnvironment, recordRegistry, undefined, program);
}

/** Type-checks one statement, passing function return type when inside a function body. */
function checkStatement(
  statement: StatementNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  functionReturnType: ResolvedType | undefined,
  program: ProgramNode,
): void {
  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      checkVariableDeclaration(statement, environment, recordRegistry, program);
      return;

    case StatementNodeType.Assignment:
      checkAssignment(statement, environment, recordRegistry, program);
      return;

    case StatementNodeType.PrintStatement:
      checkExpression(statement.value, environment, recordRegistry, program);
      return;

    case StatementNodeType.IfStatement:
      checkBooleanExpression(statement.condition, environment, recordRegistry, 'if condition', program);
      checkBlock(statement.thenBranch, environment, recordRegistry, functionReturnType, program);

      for (const elseIfChain of statement.elseIfChains) {
        checkBooleanExpression(
          elseIfChain.condition,
          environment,
          recordRegistry,
          'else if condition',
          program,
        );
        checkBlock(elseIfChain.body, environment, recordRegistry, functionReturnType, program);
      }

      if (statement.elseBranch) {
        checkBlock(statement.elseBranch, environment, recordRegistry, functionReturnType, program);
      }
      return;

    case StatementNodeType.WhileStatement:
      checkBooleanExpression(
        statement.condition,
        environment,
        recordRegistry,
        'while condition',
        program,
      );
      checkBlock(statement.body, environment, recordRegistry, functionReturnType, program);
      return;

    case StatementNodeType.DoWhileStatement:
      checkBlock(statement.body, environment, recordRegistry, functionReturnType, program);
      checkBooleanExpression(
        statement.condition,
        environment,
        recordRegistry,
        'do-while condition',
        program,
      );
      return;

    case StatementNodeType.ForStatement: {
      const loopEnvironment =
        statement.init?.type === StatementNodeType.VariableDeclaration
          ? environment.createBlockScope()
          : environment;

      if (statement.init) {
        checkStatement(statement.init, loopEnvironment, recordRegistry, functionReturnType, program);
      }

      if (statement.condition) {
        checkBooleanExpression(
          statement.condition,
          loopEnvironment,
          recordRegistry,
          'for condition',
          program,
        );
      }

      checkBlock(statement.body, loopEnvironment, recordRegistry, functionReturnType, program);

      if (statement.update) {
        checkAssignment(statement.update, loopEnvironment, recordRegistry, program);
      }
      return;
    }

    case StatementNodeType.ForeachStatement: {
      const iterableType = checkExpression(statement.iterable, environment, recordRegistry, program);
      assertResolvedType(
        iterableType,
        { kind: 'primitive', type: AstigType.String },
        'foreach iterable must be a string',
      );

      const foreachEnvironment = environment.createBlockScope();
      foreachEnvironment.declareVariable('let', statement.variable, {
        kind: 'primitive',
        type: AstigType.Char,
      });
      checkBlock(statement.body, foreachEnvironment, recordRegistry, functionReturnType, program);
      return;
    }

    case StatementNodeType.BreakStatement:
    case StatementNodeType.ContinueStatement:
      return;

    case StatementNodeType.FunctionDeclaration:
      checkFunctionDeclaration(statement, environment, recordRegistry, program);
      return;

    case StatementNodeType.ReturnStatement:
      if (functionReturnType === undefined) {
        throw new TypeCheckError('Return statement outside of a function');
      }

      checkReturnStatement(statement, functionReturnType, environment, recordRegistry, program);
      return;

    case StatementNodeType.BlockStatement:
      checkBlock(statement.body, environment, recordRegistry, functionReturnType, program);
      return;
  }
}

/** Validates a variable declaration and registers its type in the environment. */
function checkVariableDeclaration(
  declaration: VariableDeclarationNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): void {
  const valueType = checkExpression(declaration.value, environment, recordRegistry, program);

  if (valueType.kind === 'array' && !declaration.isArray){
    throw new Error(`Type error: Cannot assign an array to scalar variable "${declaration.name}". Did you forget '[]' in the type annotation?`);
  }

  if (valueType.kind !== 'array' && declaration.isArray) {
    throw new Error(`Type error: Variable "${declaration.name}" expects an array type, but received a scalar value.`);
  }

  let variableType:ResolvedType = valueType;

  if (declaration.declaredType) {
    const baseResolved = resolveDataType(declaration.declaredType, recordRegistry);
    
    if (declaration.isArray){
      if (baseResolved.kind !== 'primitive'){
        throw new Error(`Type error: Arrays of complex kinds are currently unsupported.`);
      }
      variableType = {
        kind: 'array',
        elementType: baseResolved.type
      };
    }
  } else{
    variableType = valueType;
  }

  if (declaration.declaredType){
    assertAssignable(
      variableType,
      valueType,
      `Type mismatch: cannot assign ${formatResolvedType(valueType)} to variable "${declaration.name}" of type ${formatResolvedType(variableType)}`,
    );
  }

  environment.declareVariable(declaration.declarationKind, declaration.name, variableType);
}

/** Validates assignment target and result types (`=`, `+=`, `-=`). */
function checkAssignment(
  assignment: AssignmentNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): void {
  const rightType = checkExpression(assignment.value, environment, recordRegistry, program);
  const targetType = getAssignmentTargetType(assignment.target, environment, recordRegistry);
  const resultType = getAssignmentResultType(assignment, targetType, rightType);

  assertAssignable(
    targetType,
    resultType,
    `Type mismatch: cannot assign ${formatResolvedType(resultType)} to target of type ${formatResolvedType(targetType)}`,
  );

  if (assignment.target.kind === 'variable') {
    environment.assignVariable(assignment.target.name, resultType);
  }
}

/** Resolves the expected type of an assignment target (variable or record field path). */
function getAssignmentTargetType(
  target: AssignmentTarget,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
): ResolvedType {
  if (target.kind === 'variable') {
    return environment.getVariableType(target.name);
  }

  const recordType = environment.getVariableType(target.rootVariable);
  if (recordType.kind !== 'record') {
    throw new TypeCheckError(`Variable "${target.rootVariable}" is not a record`);
  }

  const fieldTypeName = getNestedRecordFieldType(
    recordType.name,
    target.fieldPath,
    recordRegistry,
  );

  return resolveDataType(fieldTypeName, recordRegistry);
}

/** Walks a dotted field path to find the declared type of the final field. */
function getNestedRecordFieldType(
  recordTypeName: string,
  fieldPath: string[],
  recordRegistry: RecordRegistry,
): string {
  if (fieldPath.length === 0) {
    throw new TypeCheckError('Record field path cannot be empty');
  }

  const [fieldName, ...remainingPath] = fieldPath;
  const fieldTypeName = recordRegistry.getFieldType(recordTypeName, fieldName);

  if (!fieldTypeName) {
    throw new TypeCheckError(
      `Field "${fieldName}" not found on record "${recordTypeName}"`,
    );
  }

  if (remainingPath.length === 0) {
    return fieldTypeName;
  }

  const nestedType = resolveDataType(fieldTypeName, recordRegistry);
  if (nestedType.kind !== 'record') {
    throw new TypeCheckError(`Field "${fieldName}" on record "${recordTypeName}" is not a record`);
  }

  return getNestedRecordFieldType(nestedType.name, remainingPath, recordRegistry);
}

/** Infers the resulting type after applying a compound assignment operator. */
function getAssignmentResultType(
  assignment: AssignmentNode,
  leftType: ResolvedType,
  rightType: ResolvedType,
): ResolvedType {
  if (assignment.operator === '=') {
    return rightType;
  }

  if (assignment.operator === '+=') {
    const leftIsString =
      leftType.kind === 'primitive' && leftType.type === AstigType.String;
    const rightIsString =
      rightType.kind === 'primitive' && rightType.type === AstigType.String;

    if (leftIsString || rightIsString) {
      return { kind: 'primitive', type: AstigType.String };
    }

    assertNumericOperation(leftType, rightType, '+=');
    return combineNumericTypes(leftType, rightType);
  }

  if (assignment.operator === '-=') {
    assertNumericOperation(leftType, rightType, '-=');
    return combineNumericTypes(leftType, rightType);
  }

  throw new TypeCheckError(`Unsupported assignment operator "${assignment.operator}"`);
}

/** Registers a function and type-checks its parameters and body. */
function checkFunctionDeclaration(
  functionNode: FunctionDeclarationNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): void {
  if (!environment.hasFunction(functionNode.name)) {
    environment.declareFunction(functionNode);
  }

  const functionEnvironment = environment.createFunctionScope();
  for (const parameter of functionNode.parameters) {
    const parameterType = parameter.declaredType
      ? resolveDataType(parameter.declaredType, recordRegistry)
      : { kind: 'primitive', type: AstigType.Any } as ResolvedType;

    functionEnvironment.declareVariable('let', parameter.name, parameterType);
  }

  const returnType = functionNode.returnType
    ? resolveDataType(functionNode.returnType, recordRegistry)
    : ({ kind: 'primitive', type: AstigType.Any } as ResolvedType);

  checkFunctionBody(functionNode.body, functionEnvironment, recordRegistry, returnType, program);
}

/** Type-checks all statements in a function body against the declared return type. */
function checkFunctionBody(
  statements: StatementNode[],
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  returnType: ResolvedType,
  program: ProgramNode,
): void {
  for (const statement of statements) {
    checkStatement(statement, environment, recordRegistry, returnType, program);
  }
}

/** Ensures a return statement matches the enclosing function's return type. */
function checkReturnStatement(
  statement: Extract<StatementNode, { type: StatementNodeType.ReturnStatement }>,
  returnType: ResolvedType,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): void {
  const isVoidReturn =
    returnType.kind === 'primitive' && returnType.type === AstigType.Void;

  if (isVoidReturn) {
    if (statement.value) {
      const valueType = checkExpression(statement.value, environment, recordRegistry, program);
      throw new TypeCheckError(
        `Type mismatch: void function cannot return ${formatResolvedType(valueType)}`,
      );
    }
    return;
  }

  if (!statement.value) {
    if (returnType.kind === 'primitive' && returnType.type === AstigType.Any) {
      return;
    }

    throw new TypeCheckError(
      `Type mismatch: function must return ${formatResolvedType(returnType)}`,
    );
  }

  const valueType = checkExpression(statement.value, environment, recordRegistry, program);
  assertAssignable(
    returnType,
    valueType,
    `Type mismatch: cannot return ${formatResolvedType(valueType)} from function with return type ${formatResolvedType(returnType)}`,
  );
}

/** Type-checks statements inside `{ ... }` using a new block scope. */
function checkBlock(
  statements: StatementNode[],
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  functionReturnType: ResolvedType | undefined,
  program: ProgramNode,
): void {
  const blockEnvironment = environment.createBlockScope();

  for (const statement of statements) {
    checkStatement(statement, blockEnvironment, recordRegistry, functionReturnType, program);
  }
}

/** Requires an expression to have boolean type (if/while/for conditions). */
function checkBooleanExpression(
  expression: ExpressionNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  context: string,
  program: ProgramNode,
): void {
  const expressionType = checkExpression(expression, environment, recordRegistry, program);
  assertResolvedType(
    expressionType,
    { kind: 'primitive', type: AstigType.Boolean },
    `Type mismatch: ${context} must be boolean, got ${formatResolvedType(expressionType)}`,
  );
}

/** Type-checks an expression and returns its inferred `ResolvedType`. */
function checkExpression(
  expression: ExpressionNode,
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): ResolvedType {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
      return {
        kind: 'primitive',
        type: Number.isInteger(expression.value) ? AstigType.Int : AstigType.Float,
      };

    case ExpressionNodeType.FloatLiteral:
      return { kind: 'primitive', type: AstigType.Float };

    case ExpressionNodeType.StringLiteral:
      return { kind: 'primitive', type: AstigType.String };

    case ExpressionNodeType.BooleanLiteral:
      return { kind: 'primitive', type: AstigType.Boolean };

    case ExpressionNodeType.Identifier:
      return environment.getVariableType(expression.name);
    
    case ExpressionNodeType.ArrayIndexAccess:{
      // 1. Look up the array variable container type configuration
      const arrayContainerResolved = environment.getVariableType(expression.arrayName);

      // 2. Type Narrowing! Make sure the variable is structurally an array kind
      if (arrayContainerResolved.kind !== 'array') {
        throw new Error(`Type Error: Cannot index into non-array variable "${expression.arrayName}".`);
      }

      // 3. Type check the index sub-expression itself to ensure it's an integer
      const indexResolved = checkExpression(expression.index, environment, recordRegistry, program);
      if (indexResolved.kind !== 'primitive' || indexResolved.type !== AstigType.Int) {
        throw new Error(`Type Error: Array subscript index must evaluate to an Integer primitive.`);
      }

      // 4. Return the inner type wrapped by the array container structure
      return {
        kind: 'primitive',
        type: arrayContainerResolved.elementType // 🎉 Safely isolated because we guarded for kind: 'array'!
      };
    }
    
    
    
    case ExpressionNodeType.ArrayLiteral:{
      let detectedType = AstigType.Any; 

      if (expression.elements.length > 0) {
        // 1. Get the ResolvedType for the first element
        const firstElementResolved = checkExpression(expression.elements[0], environment, recordRegistry, program);
        
        // 2. Type Narrowing! Check the 'kind' field first
        if (firstElementResolved.kind === 'primitive') {
            // Inside this 'if', TypeScript securely allows you to read '.type'!
            detectedType = firstElementResolved.type; 
        } else if (firstElementResolved.kind === 'array') {
            // If it's a nested array (e.g., [[1, 2], [3, 4]]), you'd pull '.elementType'
            detectedType = firstElementResolved.elementType;
        } else if (firstElementResolved.kind === 'record') {
            // Handle record structs if needed via '.name'
            throw new Error("Type Error: Arrays of records are currently unsupported.");
        }
      }

      // 3. Return the array structural shape
      return { 
        kind: 'array', 
        elementType: detectedType 
      };
    }

    case ExpressionNodeType.MemberAccess: {
      const objectType = checkExpression(expression.object, environment, recordRegistry, program);
      if (objectType.kind !== 'record') {
        throw new TypeCheckError(
          `Cannot access member "${expression.field}" on ${formatResolvedType(objectType)}`,
        );
      }

      const fieldTypeName = recordRegistry.getFieldType(objectType.name, expression.field);
      if (!fieldTypeName) {
        throw new TypeCheckError(
          `Field "${expression.field}" not found on record "${objectType.name}"`,
        );
      }

      return resolveDataType(fieldTypeName, recordRegistry);
    }

    case ExpressionNodeType.RecordLiteral: {
      if (!recordRegistry.has(expression.recordTypeName)) {
        throw new TypeCheckError(`Unknown record type "${expression.recordTypeName}"`);
      }

      for (const field of expression.fields) {
        const fieldDefinition = recordRegistry
          .getFields(expression.recordTypeName)
          .find((recordField) => recordField.name === field.name);

        if (!fieldDefinition) {
          throw new TypeCheckError(
            `Field "${field.name}" is not declared on record "${expression.recordTypeName}"`,
          );
        }

        const fieldValueType = checkExpression(field.value, environment, recordRegistry, program);
        const expectedFieldType = resolveDataType(fieldDefinition.declaredType, recordRegistry);
        assertAssignable(
          expectedFieldType,
          fieldValueType,
          `Type mismatch: record field "${field.name}" expects ${formatResolvedType(expectedFieldType)}, got ${formatResolvedType(fieldValueType)}`,
        );
      }

      return { kind: 'record', name: expression.recordTypeName };
    }

    case ExpressionNodeType.UnaryExpression: {
      const argumentType = checkExpression(expression.argument, environment, recordRegistry, program);
      assertNumericOperation(argumentType, argumentType, expression.operator);
      return argumentType;
    }

    case ExpressionNodeType.BinaryExpression: {
      const leftType = checkExpression(expression.left, environment, recordRegistry, program);
      const rightType = checkExpression(expression.right, environment, recordRegistry, program);
      const operator = expression.operator;

      switch (operator) {
        case '+': {
          const leftIsString =
            leftType.kind === 'primitive' && leftType.type === AstigType.String;
          const rightIsString =
            rightType.kind === 'primitive' && rightType.type === AstigType.String;

          if (leftIsString || rightIsString) {
            return { kind: 'primitive', type: AstigType.String };
          }

          assertNumericOperation(leftType, rightType, '+');
          return combineNumericTypes(leftType, rightType);
        }

        case '-':
        case '*':
        case '/':
          assertNumericOperation(leftType, rightType, operator);
          return combineNumericTypes(leftType, rightType);

        case '==':
        case '!=':
          assertComparableTypes(leftType, rightType, operator);
          return { kind: 'primitive', type: AstigType.Boolean };

        case '<':
        case '>':
        case '<=':
        case '>=':
          assertNumericOperation(leftType, rightType, operator);
          return { kind: 'primitive', type: AstigType.Boolean };

        default:
          throw new TypeCheckError(`Unsupported binary operator "${operator}"`);
      }
    }

    case ExpressionNodeType.FunctionCall:
      return checkFunctionCall(
        expression.name,
        expression.arguments,
        environment,
        recordRegistry,
        program,
      );
  }
}

/** Validates argument count/types and returns the function's return type. */
function checkFunctionCall(
  name: string,
  args: ExpressionNode[],
  environment: TypeEnvironment,
  recordRegistry: RecordRegistry,
  program: ProgramNode,
): ResolvedType {
  let functionNode: FunctionDeclarationNode;

  try {
    functionNode = environment.getFunction(name);
  } catch (error) {
    // Give a clear export error instead of a generic "undefined function".
    const privateFunction = findFunctionInModules(name, program.moduleFunctions);
    if (privateFunction && !privateFunction.isExported) {
      throw new TypeCheckError(
        `Function "${name}" is not exported from "${privateFunction.sourceModule}"`,
      );
    }

    throw error;
  }

  if (args.length !== functionNode.parameters.length) {
    throw new TypeCheckError(
      `Function "${name}" expected ${functionNode.parameters.length} arguments but got ${args.length}`,
    );
  }

  functionNode.parameters.forEach((parameter, index) => {
    const argumentType = checkExpression(args[index], environment, recordRegistry, program);
    const parameterType = parameter.declaredType
      ? resolveDataType(parameter.declaredType, recordRegistry)
      : ({ kind: 'primitive', type: AstigType.Any } as ResolvedType);

    assertAssignable(
      parameterType,
      argumentType,
      `Type mismatch: argument ${index + 1} for "${name}" must be ${formatResolvedType(parameterType)}, got ${formatResolvedType(argumentType)}`,
    );
  });

  return functionNode.returnType
    ? resolveDataType(functionNode.returnType, recordRegistry)
    : ({ kind: 'primitive', type: AstigType.Any } as ResolvedType);
}

function assertNumericOperation(
  leftType: ResolvedType,
  rightType: ResolvedType,
  operator: string,
): void {
  if (
    leftType.kind !== 'primitive' ||
    rightType.kind !== 'primitive' ||
    !isNumericType(leftType.type) ||
    !isNumericType(rightType.type)
  ) {
    throw new TypeCheckError(
      `Type mismatch: operator "${operator}" requires numeric operands, got ${formatResolvedType(leftType)} and ${formatResolvedType(rightType)}`,
    );
  }
}

function assertComparableTypes(
  leftType: ResolvedType,
  rightType: ResolvedType,
  operator: string,
): void {
  if (isAssignableType(leftType, rightType) || isAssignableType(rightType, leftType)) {
    return;
  }

  throw new TypeCheckError(
    `Type mismatch: operator "${operator}" cannot compare ${formatResolvedType(leftType)} and ${formatResolvedType(rightType)}`,
  );
}

function combineNumericTypes(
  leftType: ResolvedType,
  rightType: ResolvedType,
): ResolvedType {
  if (leftType.kind !== 'primitive' || rightType.kind !== 'primitive') {
    throw new TypeCheckError('Numeric operations require primitive numeric types');
  }

  if (leftType.type === AstigType.Float || rightType.type === AstigType.Float) {
    return { kind: 'primitive', type: AstigType.Float };
  }

  return { kind: 'primitive', type: AstigType.Int };
}

function assertAssignable(
  expected: ResolvedType,
  actual: ResolvedType,
  message: string,
): void {
  if (!isAssignableType(expected, actual)) {
    throw new TypeCheckError(message);
  }
}

function assertResolvedType(
  actual: ResolvedType,
  expected: ResolvedType,
  message: string,
): void {
  if (!isAssignableType(expected, actual)) {
    throw new TypeCheckError(message);
  }
}

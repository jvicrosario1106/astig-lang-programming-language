/**
 * Formats AstigLang AST nodes as indented ASCII for pipeline demos.
 */
import { ExpressionNode, ExpressionNodeType } from '../models/ExpressionNode';
import { ProgramNode } from '../models/ProgramNode';
import { StatementNode, StatementNodeType } from '../models/StatementNode';

function indentLine(depth: number, text: string): string {
  return `${'  '.repeat(depth)}${text}`;
}

function formatLocation(node: { location?: { line: number; column: number } }): string {
  if (!node.location) {
    return '';
  }
  return ` @ ${node.location.line}:${node.location.column}`;
}

function formatExpression(expression: ExpressionNode, depth: number): string[] {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
      return [indentLine(depth, `NumberLiteral(${expression.value})`)];
    case ExpressionNodeType.FloatLiteral:
      return [indentLine(depth, `FloatLiteral(${expression.value})`)];
    case ExpressionNodeType.StringLiteral:
      return [indentLine(depth, `StringLiteral("${expression.value}")`)];
    case ExpressionNodeType.BooleanLiteral:
      return [indentLine(depth, `BooleanLiteral(${expression.value})`)];
    case ExpressionNodeType.Identifier:
      return [indentLine(depth, `Identifier(${expression.name})`)];
    case ExpressionNodeType.FunctionCall:
      return [
        indentLine(depth, `FunctionCall(${expression.name})`),
        ...expression.arguments.flatMap((arg) => formatExpression(arg, depth + 1)),
      ];
    case ExpressionNodeType.BinaryExpression:
      return [
        indentLine(depth, `BinaryExpression(${expression.operator})`),
        ...formatExpression(expression.left, depth + 1),
        ...formatExpression(expression.right, depth + 1),
      ];
    case ExpressionNodeType.UnaryExpression:
      return [
        indentLine(depth, `UnaryExpression(${expression.operator})`),
        ...formatExpression(expression.argument, depth + 1),
      ];
    case ExpressionNodeType.MemberAccess:
      return [
        indentLine(depth, `MemberAccess(.${expression.field})`),
        ...formatExpression(expression.object, depth + 1),
      ];
    case ExpressionNodeType.ArrayIndexAccess:
      return [
        indentLine(depth, `ArrayIndexAccess(${expression.arrayName})`),
        ...formatExpression(expression.index, depth + 1),
      ];
    case ExpressionNodeType.ArrayLiteral:
      return [
        indentLine(depth, 'ArrayLiteral'),
        ...expression.elements.flatMap((element) => formatExpression(element, depth + 1)),
      ];
    case ExpressionNodeType.RecordLiteral:
      return [
        indentLine(depth, `RecordLiteral(${expression.recordTypeName})`),
        ...expression.fields.flatMap((field) => [
          indentLine(depth + 1, `field ${field.name}`),
          ...formatExpression(field.value, depth + 2),
        ]),
      ];
    case ExpressionNodeType.Malloc:
      return [
        indentLine(depth, 'MallocExpression'),
        ...formatExpression(expression.sizeExpr, depth + 1)
      ];
    case ExpressionNodeType.Realloc:
      return [
        indentLine(depth, 'ReallocExpression'),
        ...formatExpression(expression.ptrExpr, depth + 1),
        ...formatExpression(expression.sizeExpr, depth + 1)
      ];
  }
}

function formatAssignmentTarget(
  target: Extract<StatementNode, { type: StatementNodeType.Assignment }>['target'],
  depth: number,
): string[] {
  if (target.kind === 'variable') {
    return [indentLine(depth, `target variable(${target.name})`)];
  }

  if (target.kind === 'dereference'){
    return [indentLine(depth, 'target dereference(*)'),
      ...formatExpression(target.pointerExpression, depth + 1)
    ];
  }

  return [
    indentLine(
      depth,
      `target recordField(${target.rootVariable}.${target.fieldPath.join('.')})`,
    ),
  ];
}

function formatStatement(statement: StatementNode, depth: number): string[] {
  const loc = formatLocation(statement);

  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      return [
        indentLine(
          depth,
          `VariableDeclaration(${statement.declarationKind} ${statement.name}: ${statement.declaredType ?? '?'}${statement.isArray ? '[]' : ''})${loc}`,
        ),
        ...(statement.value ? formatExpression(statement.value, depth + 1) : []),
      ];
    case StatementNodeType.Assignment:
      return [
        indentLine(depth, `Assignment(${statement.operator})${loc}`),
        ...formatAssignmentTarget(statement.target, depth + 1),
        ...formatExpression(statement.value, depth + 1),
      ];
    case StatementNodeType.ArrayIndexAssignment:
      return [
        indentLine(
          depth,
          `ArrayIndexAssignment(${statement.arrayName} ${statement.operator})${loc}`,
        ),
        ...formatExpression(statement.index, depth + 1),
        ...formatExpression(statement.value, depth + 1),
      ];
    case StatementNodeType.PrintStatement:
      return [
        indentLine(depth, `PrintStatement${loc}`),
        ...formatExpression(statement.value, depth + 1),
      ];
    case StatementNodeType.ScanStatement:
      return [
        indentLine(
          depth,
          `ScanStatement(${statement.promptMessage ?? 'no prompt'} → ${statement.variableName})${loc}`,
        ),
      ];
    case StatementNodeType.IfStatement:
      return [
        indentLine(depth, `IfStatement${loc}`),
        indentLine(depth + 1, 'condition'),
        ...formatExpression(statement.condition, depth + 2),
        indentLine(depth + 1, 'then'),
        ...statement.thenBranch.flatMap((stmt) => formatStatement(stmt, depth + 2)),
        ...statement.elseIfChains.flatMap((branch, index) => [
          indentLine(depth + 1, `elseIf[${index}]`),
          indentLine(depth + 2, 'condition'),
          ...formatExpression(branch.condition, depth + 3),
          ...branch.body.flatMap((stmt) => formatStatement(stmt, depth + 2)),
        ]),
        ...(statement.elseBranch
          ? [
              indentLine(depth + 1, 'else'),
              ...statement.elseBranch.flatMap((stmt) => formatStatement(stmt, depth + 2)),
            ]
          : []),
      ];
    case StatementNodeType.WhileStatement:
      return [
        indentLine(depth, `WhileStatement${loc}`),
        indentLine(depth + 1, 'condition'),
        ...formatExpression(statement.condition, depth + 2),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
      ];
    case StatementNodeType.DoWhileStatement:
      return [
        indentLine(depth, `DoWhileStatement${loc}`),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
        indentLine(depth + 1, 'condition'),
        ...formatExpression(statement.condition, depth + 2),
      ];
    case StatementNodeType.ForStatement:
      return [
        indentLine(depth, `ForStatement${loc}`),
        ...(statement.init ? formatStatement(statement.init as StatementNode, depth + 1) : []),
        ...(statement.condition
          ? [
              indentLine(depth + 1, 'condition'),
              ...formatExpression(statement.condition, depth + 2),
            ]
          : []),
        ...(statement.update ? formatStatement(statement.update, depth + 1) : []),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
      ];
    case StatementNodeType.ForeachStatement:
      return [
        indentLine(depth, `ForeachStatement(${statement.variable} in ...)${loc}`),
        ...formatExpression(statement.iterable, depth + 1),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
      ];
    case StatementNodeType.BreakStatement:
      return [indentLine(depth, `BreakStatement${loc}`)];
    case StatementNodeType.ContinueStatement:
      return [indentLine(depth, `ContinueStatement${loc}`)];
    case StatementNodeType.ReturnStatement:
      return [
        indentLine(depth, `ReturnStatement${loc}`),
        ...(statement.value ? formatExpression(statement.value, depth + 1) : []),
      ];
    case StatementNodeType.BlockStatement:
      return [
        indentLine(depth, `BlockStatement${loc}`),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
      ];
    case StatementNodeType.FunctionDeclaration:
      return [
        indentLine(
          depth,
          `FunctionDeclaration(${statement.isExported ? 'export ' : ''}${statement.name}${statement.returnType ? `: ${statement.returnType}` : ''})${loc}`,
        ),
        ...statement.parameters.map((param) =>
          indentLine(depth + 1, `param ${param.name}: ${param.declaredType ?? '?'}`),
        ),
        ...statement.body.flatMap((stmt) => formatStatement(stmt, depth + 1)),
      ];
    case StatementNodeType.FreeStatement:
      return [
        indentLine(depth, `FreeStatement${loc}`),
        ...formatExpression(statement.ptrExpr, depth + 1)
      ];
    case StatementNodeType.MemsetStatement:
      return [
        indentLine(depth, `MemsetStatement${loc}`),
        indentLine(depth + 1, 'dest'),
        ...formatExpression(statement.ptrExpr, depth + 2),
        indentLine(depth + 1, 'value'),
        ...formatExpression(statement.valueExpr, depth + 2),
        indentLine(depth + 1, 'size'),
        ...formatExpression(statement.sizeExpr, depth + 2)
      ];
  }
}

function locationJson(node: { location?: { line: number; column: number } }) {
  return node.location ? { line: node.location.line, column: node.location.column } : undefined;
}

function serializeExpression(expression: ExpressionNode): object {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
      return { type: expression.type, value: expression.value };
    case ExpressionNodeType.FloatLiteral:
      return { type: expression.type, value: expression.value };
    case ExpressionNodeType.StringLiteral:
      return { type: expression.type, value: expression.value };
    case ExpressionNodeType.BooleanLiteral:
      return { type: expression.type, value: expression.value };
    case ExpressionNodeType.Identifier:
      return { type: expression.type, name: expression.name };
    case ExpressionNodeType.FunctionCall:
      return {
        type: expression.type,
        name: expression.name,
        arguments: expression.arguments.map(serializeExpression),
      };
    case ExpressionNodeType.BinaryExpression:
      return {
        type: expression.type,
        operator: expression.operator,
        left: serializeExpression(expression.left),
        right: serializeExpression(expression.right),
      };
    case ExpressionNodeType.UnaryExpression:
      return {
        type: expression.type,
        operator: expression.operator,
        argument: serializeExpression(expression.argument),
      };
    case ExpressionNodeType.MemberAccess:
      return {
        type: expression.type,
        field: expression.field,
        object: serializeExpression(expression.object),
      };
    case ExpressionNodeType.ArrayIndexAccess:
      return {
        type: expression.type,
        arrayName: expression.arrayName,
        index: serializeExpression(expression.index),
      };
    case ExpressionNodeType.ArrayLiteral:
      return {
        type: expression.type,
        elements: expression.elements.map(serializeExpression),
      };
    case ExpressionNodeType.RecordLiteral:
      return {
        type: expression.type,
        recordTypeName: expression.recordTypeName,
        fields: expression.fields.map((field) => ({
          name: field.name,
          value: serializeExpression(field.value),
        })),
      };
    case ExpressionNodeType.Malloc:
      return {
        type: expression.type,
        sizeExpr: serializeExpression(expression.sizeExpr)
      };
    case ExpressionNodeType.Realloc:
      return {
        type: expression.type,
        ptrExpr: serializeExpression(expression.ptrExpr),
        sizeExpr: serializeExpression(expression.sizeExpr)
      };
  }
}

function serializeStatement(statement: StatementNode): object {
  const location = locationJson(statement);

  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        declarationKind: statement.declarationKind,
        name: statement.name,
        declaredType: statement.declaredType,
        isArray: statement.isArray,
        ...(statement.value
          ? { value: serializeExpression(statement.value) }
          : {}),
      };
    case StatementNodeType.Assignment:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        operator: statement.operator,
        target: statement.target,
        value: serializeExpression(statement.value),
      };
    case StatementNodeType.ArrayIndexAssignment:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        arrayName: statement.arrayName,
        index: serializeExpression(statement.index),
        operator: statement.operator,
        value: serializeExpression(statement.value),
      };
    case StatementNodeType.PrintStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        value: serializeExpression(statement.value),
      };
    case StatementNodeType.ScanStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        promptMessage: statement.promptMessage,
        variableName: statement.variableName,
      };
    case StatementNodeType.IfStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        condition: serializeExpression(statement.condition),
        thenBranch: statement.thenBranch.map(serializeStatement),
        elseIfChains: statement.elseIfChains.map((branch) => ({
          condition: serializeExpression(branch.condition),
          body: branch.body.map(serializeStatement),
        })),
        ...(statement.elseBranch
          ? { elseBranch: statement.elseBranch.map(serializeStatement) }
          : {}),
      };
    case StatementNodeType.WhileStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        condition: serializeExpression(statement.condition),
        body: statement.body.map(serializeStatement),
      };
    case StatementNodeType.DoWhileStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        body: statement.body.map(serializeStatement),
        condition: serializeExpression(statement.condition),
      };
    case StatementNodeType.ForStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        ...(statement.init ? { init: serializeStatement(statement.init as StatementNode) } : {}),
        ...(statement.condition
          ? { condition: serializeExpression(statement.condition) }
          : {}),
        ...(statement.update ? { update: serializeStatement(statement.update) } : {}),
        body: statement.body.map(serializeStatement),
      };
    case StatementNodeType.ForeachStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        variable: statement.variable,
        iterable: serializeExpression(statement.iterable),
        body: statement.body.map(serializeStatement),
      };
    case StatementNodeType.BreakStatement:
      return { type: statement.type, ...(location ? { location } : {}) };
    case StatementNodeType.ContinueStatement:
      return { type: statement.type, ...(location ? { location } : {}) };
    case StatementNodeType.ReturnStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        ...(statement.value ? { value: serializeExpression(statement.value) } : {}),
      };
    case StatementNodeType.BlockStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        body: statement.body.map(serializeStatement),
      };
    case StatementNodeType.FunctionDeclaration:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        name: statement.name,
        isExported: statement.isExported,
        ...(statement.sourceModule ? { sourceModule: statement.sourceModule } : {}),
        parameters: statement.parameters.map((param) => ({
          name: param.name,
          declaredType: param.declaredType,
        })),
        returnType: statement.returnType,
        body: statement.body.map(serializeStatement),
      };
    case StatementNodeType.FreeStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        ptrExpr: serializeExpression(statement.ptrExpr)
      };
    case StatementNodeType.MemsetStatement:
      return {
        type: statement.type,
        ...(location ? { location } : {}),
        ptrExpr: serializeExpression(statement.ptrExpr),
        valueExpr: serializeExpression(statement.valueExpr),
        sizeExpr: serializeExpression(statement.sizeExpr)
      };
  }
}

/** Returns a plain JSON-serializable tree for a `ProgramNode`. */
export function serializeProgramAst(program: ProgramNode): object {
  return {
    type: program.type,
    ...(program.entryModule ? { entryModule: program.entryModule } : {}),
    includes: program.includes.map((include) => ({ filename: include.filename })),
    recordDeclarations: program.recordDeclarations,
    functions: program.functions.map(serializeStatement),
    ...(program.mainFunction
      ? {
          mainFunction: {
            type: program.mainFunction.type,
            body: program.mainFunction.body.map(serializeStatement),
          },
        }
      : {}),
  };
}

function truncateFormattedOutput(text: string, maxLines: number): string {
  const lines = text.split('\n');
  if (lines.length <= maxLines) {
    return text;
  }

  const hidden = lines.length - maxLines;
  return `${lines.slice(0, maxLines).join('\n')}\n... [${hidden} more lines truncated]`;
}

/** Returns a pretty-printed JSON dump of a `ProgramNode`. */
export function formatProgramAstJson(program: ProgramNode, maxLines = 500): string {
  const json = JSON.stringify(serializeProgramAst(program), null, 2);
  return truncateFormattedOutput(json, maxLines);
}

/** Returns an indented ASCII dump of a `ProgramNode`. */
export function formatProgramAst(program: ProgramNode, maxLines = 500): string {
  const lines: string[] = [indentLine(0, 'Program')];

  for (const include of program.includes) {
    lines.push(indentLine(1, `Include(${include.filename})`));
  }

  for (const record of program.recordDeclarations) {
    lines.push(indentLine(1, `RecordDeclaration(${record.name})`));
    for (const field of record.fields) {
      lines.push(indentLine(2, `field ${field.name}: ${field.declaredType}`));
    }
  }

  for (const functionNode of program.functions) {
    lines.push(...formatStatement(functionNode, 1));
  }

  if (program.mainFunction) {
    lines.push(indentLine(1, 'MainFunction(mHA1Ns)'));
    lines.push(
      ...program.mainFunction.body.flatMap((stmt) => formatStatement(stmt, 2)),
    );
  }

  return truncateFormattedOutput(lines.join('\n'), maxLines);
}

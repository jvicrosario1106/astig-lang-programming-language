import { ProgramNode } from './models/ProgramNode';
import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import {
  AssignmentTarget,
  FunctionDeclarationNode,
  StatementNode,
  StatementNodeType,
} from './models/StatementNode';
import { MainFunctionNode } from './models/MainFunctionNode';

/** Tracks variable/function names that must be kept during dead-code elimination. */
function markAssignmentTargetUsed(
  target: AssignmentTarget,
  usedSymbols: Set<string>,
  visitExpression: (node: ExpressionNode) => void,
): void {
  switch (target.kind) {
    case 'variable':
      usedSymbols.add(target.name);
      break;
    case 'recordField':
      usedSymbols.add(target.rootVariable);
      break;
    case 'dereference':
      visitExpression(target.pointerExpression);
      break;
  }
}

/** Variables declared more than once in the same block must all be preserved (redeclaration errors). */
function markDuplicateVariableNamesInBlock(
  statements: StatementNode[],
  usedSymbols: Set<string>,
): void {
  const declarationCounts = new Map<string, number>();

  for (const statement of statements) {
    if (statement.type === StatementNodeType.VariableDeclaration) {
      declarationCounts.set(
        statement.name,
        (declarationCounts.get(statement.name) ?? 0) + 1,
      );
    }
  }

  for (const [name, count] of declarationCounts) {
    if (count > 1) {
      usedSymbols.add(name);
    }
  }
}

function createUseAnalysisVisitor(usedSymbols: Set<string>) {
  function visitExpression(node: ExpressionNode): void {
    if (!node) return;

    switch (node.type) {
      case ExpressionNodeType.Identifier:
        usedSymbols.add(node.name);
        break;

      case ExpressionNodeType.UnaryExpression:
        visitExpression(node.argument);
        break;

      case ExpressionNodeType.BinaryExpression:
        visitExpression(node.left);
        visitExpression(node.right);
        break;

      case ExpressionNodeType.FunctionCall:
        usedSymbols.add(node.name);
        node.arguments.forEach(visitExpression);
        break;

      case ExpressionNodeType.ArrayIndexAccess:
        usedSymbols.add(node.arrayName);
        visitExpression(node.index);
        break;

      case ExpressionNodeType.ArrayLiteral:
        node.elements.forEach(visitExpression);
        break;

      case ExpressionNodeType.RecordLiteral:
        node.fields.forEach((field) => visitExpression(field.value));
        break;

      case ExpressionNodeType.MemberAccess:
        visitExpression(node.object);
        break;

      case ExpressionNodeType.Malloc:
        visitExpression(node.sizeExpr);
        break;

      case ExpressionNodeType.Realloc:
        visitExpression(node.ptrExpr);
        visitExpression(node.sizeExpr);
        break;

      default:
        break;
    }
  }

  function visitBlock(statements: StatementNode[]): void {
    markDuplicateVariableNamesInBlock(statements, usedSymbols);
    statements.forEach(visitStatement);
  }

  function visitStatement(node: StatementNode): void {
    if (!node) return;

    switch (node.type) {
      case StatementNodeType.VariableDeclaration:
        if (node.value) {
          visitExpression(node.value);
        }
        break;

      case StatementNodeType.Assignment:
        markAssignmentTargetUsed(node.target, usedSymbols, visitExpression);
        visitExpression(node.value);
        break;

      case StatementNodeType.ArrayIndexAssignment:
        usedSymbols.add(node.arrayName);
        visitExpression(node.index);
        visitExpression(node.value);
        break;

      case StatementNodeType.ScanStatement:
        usedSymbols.add(node.variableName);
        break;

      case StatementNodeType.PrintStatement:
        visitExpression(node.value);
        break;

      case StatementNodeType.IfStatement:
        visitExpression(node.condition);
        visitBlock(node.thenBranch);
        node.elseIfChains.forEach((chain) => {
          visitExpression(chain.condition);
          visitBlock(chain.body);
        });
        if (node.elseBranch) {
          visitBlock(node.elseBranch);
        }
        break;

      case StatementNodeType.WhileStatement:
        visitExpression(node.condition);
        visitBlock(node.body);
        break;

      case StatementNodeType.DoWhileStatement:
        visitBlock(node.body);
        visitExpression(node.condition);
        break;

      case StatementNodeType.ForStatement:
        if (node.init) {
          visitStatement(node.init);
        }
        if (node.condition) {
          visitExpression(node.condition);
        }
        if (node.update) {
          visitStatement(node.update);
        }
        visitBlock(node.body);
        break;

      case StatementNodeType.ForeachStatement:
        usedSymbols.add(node.variable);
        visitExpression(node.iterable);
        visitBlock(node.body);
        break;

      case StatementNodeType.ReturnStatement:
        if (node.value) {
          visitExpression(node.value);
        }
        break;

      case StatementNodeType.BlockStatement:
        visitBlock(node.body);
        break;

      case StatementNodeType.FunctionDeclaration:
        visitBlock(node.body);
        break;

      case StatementNodeType.FreeStatement:
        visitExpression(node.ptrExpr);
        break;

      case StatementNodeType.MemsetStatement:
        visitExpression(node.ptrExpr);
        visitExpression(node.valueExpr);
        visitExpression(node.sizeExpr);
        break;

      case StatementNodeType.BreakStatement:
      case StatementNodeType.ContinueStatement:
        break;
    }
  }

  return { visitExpression, visitStatement, visitBlock };
}

export function collectUsedSymbols(program: ProgramNode): Set<string> {
  const usedSymbols = new Set<string>();
  const { visitBlock } = createUseAnalysisVisitor(usedSymbols);

  if (program.mainFunction) {
    visitBlock(program.mainFunction.body);
  }

  program.functions.forEach((func) => visitBlock(func.body));

  for (const moduleFunctions of Object.values(program.moduleFunctions)) {
    moduleFunctions.forEach((func) => visitBlock(func.body));
  }

  return usedSymbols;
}

function optimizeBlock(statements : StatementNode[], usedSymbols: Set<string>, constants: Map<string, ExpressionNode>) : StatementNode[] {
    const optimized: StatementNode[] = [];
    let reachable = true;
        
    for (const stmt of statements){
        if (!reachable){
            continue;
        }

        const optimizedStmt = optimizeStatement(stmt, usedSymbols, constants);

        if (optimizedStmt != null){
            if (Array.isArray(optimizedStmt)){
                optimized.push(...optimizedStmt);
            }
            else{
                optimized.push(optimizedStmt);
            }
        }

        if (stmt.type === StatementNodeType.ReturnStatement){
            reachable = false;
        }
    }

    return optimized;
}

function optimizeElseIfChains(
    chains: Array<{ condition: ExpressionNode; body: StatementNode[] }>, 
    usedSymbols: Set<string>,
    constants: Map<string, ExpressionNode>) {
    return chains.map(chain => ({
        condition: chain.condition,
        body: optimizeBlock(chain.body, usedSymbols, constants) // Passes usedSymbols down to the block optimizer
    }));
}

function isPowerOfTwo(val: number): boolean {
    return val > 0 && (val & (val - 1)) === 0;
}

function getPowerOfTwoExponent(val: number): number {
    return Math.log2(val);
}

function optimizeExpression(expr: ExpressionNode, constants: Map<string, ExpressionNode>, usedSymbols: Set<string>) : ExpressionNode {
    switch(expr.type){
        // RULE: Constant folding and Copy propagation
        case ExpressionNodeType.Identifier:{
            let currentKey = expr.name;
            let resolvedNode: ExpressionNode = expr;
            let propagated = false;

            // Deeply resolve propagation chains (e.g., if a -> b and b -> 26, resolve 'a' to 26)
            while (constants.has(currentKey)) {
                resolvedNode = constants.get(currentKey)!;
                if (resolvedNode.type === ExpressionNodeType.Identifier) {
                    currentKey = resolvedNode.name;
                } else {
                    break; 
                }
            }

            return resolvedNode;
        }

        case ExpressionNodeType.BinaryExpression:{
            const left = optimizeExpression(expr.left, constants, usedSymbols);
            const right = optimizeExpression(expr.right, constants, usedSymbols);

            // RULE: Constant folding by preevaluating the values
            if (left.type === ExpressionNodeType.NumberLiteral && right.type === ExpressionNodeType.NumberLiteral){
                const v1 = left.value;
                const v2 = right.value;

                switch(expr.operator){
                    // Logical operations
                    case ">" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 > v2 };
                    case "<" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 < v2 };
                    case ">=" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 >= v2 };
                    case "<=" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 <= v2 };
                    case "==" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 == v2 };
                    case "!=" : return { type: ExpressionNodeType.BooleanLiteral, value: v1 != v2 };

                    // Arithmetic operations
                    case "*" : return { type: ExpressionNodeType.NumberLiteral, value: v1 * v2 };
                    case "/" : return { type: ExpressionNodeType.NumberLiteral, value: v1 / v2 };
                    case "%" : return { type: ExpressionNodeType.NumberLiteral, value: v1 % v2 };
                    case "+" : return { type: ExpressionNodeType.NumberLiteral, value: v1 + v2 };
                    case "-" : return { type: ExpressionNodeType.NumberLiteral, value: v1 - v2 };
                }
            }

            // RULE: Algebraic simplification - Identity Additions / Subtractions (x + 0, x - 0, 0 + x)
            if (expr.operator === "+" || expr.operator === "-") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 0) {
                    return left; // x + 0 => x
                }
                if (left.type === ExpressionNodeType.NumberLiteral && left.value === 0 && expr.operator === "+") {
                    return right; // 0 + x => x
                }
            }

            // RULE: Algebraic simplification - Identity Multiplications / Divisions (x * 1, 1 * x)
            if (expr.operator === "*") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 1) {
                    return left; // x * 1 => x
                }
                if (left.type === ExpressionNodeType.NumberLiteral && left.value === 1) {
                    return right; // 1 * x => x
                }

                // RULE: Strength reduction - multiplication by power of 2
                const rightNumNode = right.type === ExpressionNodeType.NumberLiteral ? right : null;
                const leftNumNode = left.type === ExpressionNodeType.NumberLiteral ? left : null;

                // Handle x * 4 => x << 2
                if (rightNumNode !== null && isPowerOfTwo(rightNumNode.value)) {
                    return {
                        type: ExpressionNodeType.BinaryExpression,
                        operator: "<<",
                        left: left,
                        right: { 
                            type: ExpressionNodeType.NumberLiteral, 
                            value: getPowerOfTwoExponent(rightNumNode.value) 
                        }
                    };
                }

                // Handle 4 * x => x << 2 (Commutative property)
                if (leftNumNode !== null && isPowerOfTwo(leftNumNode.value)) {
                    return {
                        type: ExpressionNodeType.BinaryExpression,
                        operator: "<<",
                        left: right, 
                        right: { 
                            type: ExpressionNodeType.NumberLiteral, 
                            value: getPowerOfTwoExponent(leftNumNode.value) 
                        }
                    };
                }
            }

            // RULE: Algebraic simplification - Identity Divisions (x / 1)
            if (expr.operator === "/") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 1) {
                    return left; // x / 1 => x
                }

                // RULE: Strength reduction - division by power of 2 (x / 4 => x >> 2)
                if (right.type === ExpressionNodeType.NumberLiteral && isPowerOfTwo(right.value)) {
                    return {
                        type: ExpressionNodeType.BinaryExpression,
                        operator: ">>",
                        left: left,
                        right: { type: ExpressionNodeType.NumberLiteral, value: getPowerOfTwoExponent(right.value) }
                    };
                }
            }

            // RULE: Strength reduction - modulo by power of 2 (x % 4 => x & 3)
            if (expr.operator === "%") {
                if (right.type === ExpressionNodeType.NumberLiteral && isPowerOfTwo(right.value)) {
                    return {
                        type: ExpressionNodeType.BinaryExpression,
                        operator: "&",
                        left: left,
                        right: { type: ExpressionNodeType.NumberLiteral, value: right.value - 1 }
                    };
                }
            }

            return { ...expr, left, right };
        }
        
        case ExpressionNodeType.FunctionCall: {
        return {
            ...expr,
            arguments: expr.arguments.map(arg => optimizeExpression(arg, constants, usedSymbols))
        };
}
            
        default:
            return expr;
    }
}

function optimizeStatement(
    stmt: StatementNode, 
    usedSymbols: Set<string>, 
    constants: Map<string, ExpressionNode>
) : StatementNode | StatementNode[] | null {
    switch(stmt.type) {
        
        case StatementNodeType.VariableDeclaration:{
            if (!stmt.value) {
                return stmt;
            }

            const foldedValue = optimizeExpression(stmt.value, constants, usedSymbols);

            // 2. Populate the constants map if it folds down to a literal or identifier for copy propagation
            if (foldedValue.type === ExpressionNodeType.BooleanLiteral || 
                foldedValue.type === ExpressionNodeType.NumberLiteral ||
                foldedValue.type === ExpressionNodeType.Identifier) {
                constants.set(stmt.name, foldedValue);
            } else {
                // Keep the map safe by clearing old definitions if it's dynamic
                constants.delete(stmt.name);
            }

            // RULE: Unused variable elimination
            const isUsed = usedSymbols.has(stmt.name);
            if (!isUsed){
                // If it's not read anywhere, completely drop the declaration node.
                // NOTE: If initializer can have side-effects (like a terminal scan/input),
                // you should keep it, or just optimize the expression. For now, we drop it:
                return null;
            }

            return {
                ...stmt,
                value: foldedValue
            };
        }

        // HANDLE: Reassignments and 
        case StatementNodeType.Assignment: {
            const optimizedValue = optimizeExpression(stmt.value, constants, usedSymbols);
            
            // Invalidate any active propagation since the variable's value is modified
            if (stmt.target.kind == "variable"){
                constants.delete(stmt.target.name); 
            }

            return {
                ...stmt,
                value: optimizedValue
            };
        }

        // RULE: Dead branch elimination
        case StatementNodeType.IfStatement:{
            const cond = optimizeExpression(stmt.condition, constants, usedSymbols);

            if (cond.type === ExpressionNodeType.BooleanLiteral){
                if (cond.value === true){
                    // Statically true: Replace the entire 'if' with just the optimized 'then' block
                    // We wrap it in a Block statement or merge them depending on your AST capability
                    // For now, if your grammar supports inline statement blocks, we return its internals:
                    return optimizeBlock(stmt.thenBranch, usedSymbols, constants);
                }
                else{
                    // If we hit an else-if with a dynamic condition, we can't completely 
                    // eliminate the root structure anymore, but we can transform this 
                    // chain link into the new root condition!
                    for (const chain of stmt.elseIfChains){
                        // If we encounter a dynamic condition (not a static boolean), 
                        // we have to rebuild the IfStatement starting from THIS chain link.
                        const chainCond = optimizeExpression(chain.condition, constants, usedSymbols);

                        if (chainCond.type === ExpressionNodeType.BooleanLiteral){
                            // If the else-if condition is statically true, return its optimized block immediately
                            if (chainCond.value === true) return optimizeBlock(chain.body, usedSymbols, constants);
                        }
                        else {
                            return {
                                type: StatementNodeType.IfStatement,
                                condition: chainCond,
                                thenBranch: optimizeBlock(chain.body, usedSymbols, constants),
                                elseIfChains: optimizeElseIfChains(stmt.elseIfChains.slice(stmt.elseIfChains.indexOf(chain) + 1), usedSymbols, constants),
                                elseBranch: stmt.elseBranch ? optimizeBlock(stmt.elseBranch, usedSymbols, constants) : undefined
                            };
                        }
                    }
                    
                    // All conditions failed: Return the fallback else branch if it exists
                    return stmt.elseBranch ? optimizeBlock(stmt.elseBranch, usedSymbols, constants) : null;
                }
            }

            // Dynamic condition path: Optimize every branch branch internally
            const optimizedElseIfs = stmt.elseIfChains.map(chain => ({ //
                condition: chain.condition, //
                body: optimizeBlock(chain.body, usedSymbols, constants) //
            }));

            return {
                ...stmt,
                thenBranch: optimizeBlock(stmt.thenBranch, usedSymbols, constants), //
                elseIfChains: optimizedElseIfs, //
                elseBranch: stmt.elseBranch ? optimizeBlock(stmt.elseBranch, usedSymbols, constants) : undefined //
            };
        }

        // Default rule: Return the statement as is
        default:
            return stmt;
    }
}

export function optimizeProgram(program: ProgramNode) : ProgramNode {
    // Multipass optimization
    let currentProgram = program;
    let prevStringify = "";
    let currentStringify = JSON.stringify(program);

    // Loop until the AST reaches a stable point and no more dead variables drop out
    while (currentStringify !== prevStringify) {
        prevStringify = currentStringify;
        // 1. Collect the symbols in the program
        const usedSymbols = collectUsedSymbols(currentProgram);

        // 2. Clone and optimize the main entry point if it exists
        let optimizedMain: MainFunctionNode | undefined = undefined;
        if (currentProgram.mainFunction) {
            const mainConstants = new Map<string, ExpressionNode>();

            optimizedMain = {
                ...currentProgram.mainFunction,
                body: optimizeBlock(currentProgram.mainFunction.body, usedSymbols, mainConstants)
            };
        }

        // 3. Clone and optimize top-level functions
        const optimizedFunctions = currentProgram.functions.filter(fn => {
            // If the function name is never targeted by a call expression, drop it!
            return usedSymbols.has(fn.name);
        });

        // RULE: Dead function elimination - removed unused functions
        const fullyOptimizedFunctions = optimizedFunctions.map(fn => {
            const functionConstants = new Map<string, ExpressionNode>();
            return {
                ...fn,
                body: optimizeBlock(fn.body, usedSymbols, functionConstants)
            }
        });

        // 4. Clone and optimize module-level functions
        const optimizedModuleFunctions: Record<string, FunctionDeclarationNode[]> = {};
        for (const [modName, funcArray] of Object.entries(currentProgram.moduleFunctions)) {
            const functionConstants = new Map<string, ExpressionNode>();

            optimizedModuleFunctions[modName] = funcArray.map(func => ({
                ...func,
                body: optimizeBlock(func.body, usedSymbols, functionConstants)
            }));
        }

        // Return the brand-new pruned AST
        currentProgram = {
            ...currentProgram,
            mainFunction: optimizedMain,
            functions: fullyOptimizedFunctions,
            moduleFunctions: optimizedModuleFunctions
        };

        currentStringify = JSON.stringify(currentProgram);
    }
    
    return currentProgram;
}
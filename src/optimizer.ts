import { ProgramNode } from './models/ProgramNode';
import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import { StatementNode, StatementNodeType } from './models/StatementNode';
import { MainFunctionNode } from './models/MainFunctionNode';
import { FunctionDeclarationNode } from './models/StatementNode';
import { constants } from 'buffer';

export function collectUsedSymbols(program: ProgramNode): Set<string> {
    const usedSymbols = new Set<string>();

    function visitExpression(node: ExpressionNode): void {
        if (!node) return;

        switch (node.type) {
            case ExpressionNodeType.Identifier:
                // Found a variable reference! Mark it as used.
                usedSymbols.add(node.name);
                break;

            case ExpressionNodeType.UnaryExpression:
                visitExpression(node.argument);
                break;

            case ExpressionNodeType.BinaryExpression:
                visitExpression(node.left);
                visitExpression(node.right);
                break;

            // Handle other expressions your language supports (e.g., function calls)
            case ExpressionNodeType.FunctionCall:
                node.arguments.forEach(visitExpression);
                break;
                
            default:
                // Literal nodes (Numeric, Boolean, String) don't reference variables, so do nothing
                break;
        }
    }

    function visitStatement(node: StatementNode): void {
        if (!node) return;

        switch (node.type) {
            case StatementNodeType.VariableDeclaration:
                // We only care if the right-hand side initializer references *other* variables
                if (node.value) {
                    visitExpression(node.value);
                }
                break;

            case StatementNodeType.Assignment:
                // The right-hand side is being read
                visitExpression(node.value);
                // Note: The left-hand side variable is being written to, not read.
                // In advanced DCE, you track writes separately, but for a basic pass, 
                // just visiting the value expression is perfectly safe.
                break;

            case StatementNodeType.IfStatement:
                visitExpression(node.condition);
                node.thenBranch.forEach(visitStatement);
                if (node.elseBranch) {
                    node.elseBranch.forEach(visitStatement);
                }
                break;

            case StatementNodeType.PrintStatement: // or ScanStatement/ReturnStatement
                if (node.value) {
                    visitExpression(node.value);
                }
                break;
                
            // Add cases for any other block statements/loops you have
        }
    }

    if (program.mainFunction){
        program.mainFunction.body.forEach(visitStatement);
    }
    
    program.functions.forEach(func => {
        func.body.forEach(visitStatement);
    });

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

function getPowerOfTwoExponent(num: number): number | null {
    if (num <= 0 || !Number.isInteger(num)) return null;
    // Bitwise check: a power of 2 ANDed with its predecessor is always 0
    if ((num & (num - 1)) !== 0) return null;
    return Math.log2(num);
}

function optimizeExpression(expr: ExpressionNode, constants: Map<string, ExpressionNode>) : ExpressionNode {
    switch(expr.type){
        // RULE: Constant folding
        case ExpressionNodeType.Identifier:{
            if (constants.has(expr.name)){
                return constants.get(expr.name)!;
            }

            return expr;
        }

        case ExpressionNodeType.BinaryExpression:{
            const left = optimizeExpression(expr.left, constants);
            const right = optimizeExpression(expr.right, constants);

            // RULE: Algebraic simplification - Identity Additions / Subtractions (x + 0, x - 0, 0 + x)
            if (expr.operator === "+" || expr.operator === "-") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 0) {
                    return left; // x + 0 => x
                }
                if (left.type === ExpressionNodeType.NumberLiteral && left.value === 0 && expr.operator === "+") {
                    return right; // 0 + x => x
                }
            }

            // RULE: Algebraic simplification - Identity Multiplications / Divisions (x * 1, 1 * x, x / 1)
            if (expr.operator === "*") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 1) {
                    return left; // x * 1 => x
                }
                if (left.type === ExpressionNodeType.NumberLiteral && left.value === 1) {
                    return right; // 1 * x => x
                }
                // FOR strength reduction later
                // if (right.type === ExpressionNodeType.NumberLiteral){
                //     const exponent = getPowerOfTwoExponent(right.value);

                //     if (exponent !== null){
                //         return {
                //             type: ExpressionNodeType.BinaryExpression,
                //             operator: "<<",
                //             left: left,
                //             right: { type: ExpressionNodeType.NumberLiteral, value: exponent }
                //         };
                //     }
                // }
            }
            if (expr.operator === "/") {
                if (right.type === ExpressionNodeType.NumberLiteral && right.value === 1) {
                    return left; // x / 1 => x
                }
            }

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

                return { ...expr, left, right };
            }
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
            // RULE: FOld in values aby 
            // 1. Optimize the right-hand side using .value instead of .initializer
            const foldedValue = optimizeExpression(stmt.value, constants);

            // 2. Populate the constants map if it folds down to a literal
            if (foldedValue.type === ExpressionNodeType.BooleanLiteral || 
                foldedValue.type === ExpressionNodeType.NumberLiteral) {
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

        // RULE: Dead branch elimination
        case StatementNodeType.IfStatement:{
            const cond = optimizeExpression(stmt.condition, constants);

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
                        const chainCond = optimizeExpression(chain.condition, constants);

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
    const usedSymbols = collectUsedSymbols(program);

    //usedSymbols.add()

    // 2. Clone and optimize the main entry point if it exists
    let optimizedMain: MainFunctionNode | undefined = undefined;
    if (program.mainFunction) {
        const mainConstants = new Map<string, ExpressionNode>();

        optimizedMain = {
            ...program.mainFunction,
            body: optimizeBlock(program.mainFunction.body, usedSymbols, mainConstants)
        };
    }

    // 3. Clone and optimize top-level functions
    const optimizedFunctions = program.functions.filter(fn => {
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
    for (const [modName, funcArray] of Object.entries(program.moduleFunctions)) {
        const functionConstants = new Map<string, ExpressionNode>();

        optimizedModuleFunctions[modName] = funcArray.map(func => ({
            ...func,
            body: optimizeBlock(func.body, usedSymbols, functionConstants)
        }));
    }

    // Return the brand-new pruned AST
    return {
        ...program,
        mainFunction: optimizedMain,
        functions: fullyOptimizedFunctions,
        moduleFunctions: optimizedModuleFunctions
    };
}
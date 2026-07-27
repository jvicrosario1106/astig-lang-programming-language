grammar AstigLang;

// Entry program file: includes, records, functions, then required main (no top-level statements).
// Include/library files use the same grammar but omit main; only the entry file may define main.
// TODO: Add constant declaration section before the record
program: includeList* recordDeclaration* functionDeclaration* functionMainDeclaration? EOF;

// CHANGE: Added include list and include statement
includeList
    : includeStatement includeList*
    ;

includeStatement
    : INCLUDE_KW FILENAME ';'?
    ;

// All valid top-level or block-level statements.
// Add new language features here when they should behave like statements.
statement
    : variableDeclaration ';'?
    | assignment ';'?
    | arrayIndexAssignment ';'?
    | printStatement ';'?
    | scanStatement ';'?
    | ifStatement
    | whileStatement
    | doWhileStatement
    | forStatement
    | foreachStatement
    | functionDeclaration
    | returnStatement ';'?
    | breakStatement ';'?
    | continueStatement ';'?
    | block
    ;

// Variable declaration syntax.
// The declaration keyword must be a jejemonized const/var/let keyword.
// Type annotations are optional for now, inspired by TypeScript.
// Examples: v4r x4 = 10, v4r x4: iHNtSZ = 10
variableDeclaration
    : declarationKeyword IDENTIFIER typeAnnotation '=' expression
    ;

// CHANGE: Added record declaration and literal rules
recordDeclaration
    : RECORD_KW IDENTIFIER '{' recordFieldList? '}' ';'?
    ;

recordFieldList
    : recordField (',' recordField)*
    ;

recordField
    : IDENTIFIER typeAnnotation
    ;

recordLiteral
    : NEW_KW IDENTIFIER '{' recordLiteralFieldList? '}' ';'?
    ;

recordLiteralFieldList
    : recordLiteralField (',' recordLiteralField)*
    ;

recordLiteralField
    : assignment
    ;

arrayLiteral
    : '[' arrayElementList? ']' 
    ;

arrayElementList
    : expression (',' expression)*
    ;

// Groups all declaration keywords that can introduce a variable.
declarationKeyword
    : CONST_KW
    | VAR_KW
    | LET_KW
    ;

// Print statement.
// PRINT_KW is a jejemonized form of the programming keyword "print".
// Example: pr1nt(x4)
printStatement
    : PRINT_KW '(' expression ')'
    ;

scanStatement
    : SCAN_KW '(' (STRING ',')? IDENTIFIER ')' ';'?
    ;

// If statement with optional else if and else blocks.
// IF_KW and ELSE_KW are jejemonized "if" and "else".
// Supports chains: if (...) { } else if (...) { } else if (...) { } else { }
ifStatement
    : IF_KW '(' expression ')' block elseIfPart* elsePart?
    ;

// Else if branch in an if chain.
elseIfPart
    : ELSE_KW IF_KW '(' expression ')' block
    ;

// Final else branch (no condition).
elsePart
    : ELSE_KW block
    ;

// While loop.
// WHILE_KW is a jejemonized form of "while".
whileStatement
    : WHILE_KW '(' expression ')' block
    ;

// Do-while loop.
// DO_KW and WHILE_KW form a do-while construct.
// Example: d0 { pr1nt(x4) } wh1le(x4 > 0)
doWhileStatement
    : DO_KW block WHILE_KW '(' expression ')' ';'?
    ;

// For loop with init, condition, and update.
// Example: f0r(v4r i = 0; i < 10; i = i + 1) { pr1nt(i) }
forStatement
    : FOR_KW '(' forInit? ';' expression? ';' forUpdate? ')' block
    ;

// For loop initialization (usually a variable declaration or assignment).
forInit
    : variableDeclaration
    | assignment
    ;

// For loop update (usually an assignment or function call).
forUpdate
    : assignment
    | functionCall
    ;

// Assignment statement for use in for loops and elsewhere.
// CHANGE: Added record field access
// TODO: Need to add recordFieldAccess in the ast with buildAssignmentStatement Context then add this
assignment
    : IDENTIFIER assignmentOperator expression
    | recordFieldAccess assignmentOperator expression
    ;

arrayIndexAccess
    : IDENTIFIER '[' expression ']'
    ;

arrayIndexAssignment
    : IDENTIFIER '[' expression ']' assignmentOperator expression ';'
    ;

// For 'player.score' or 'player.weapon.damage'
recordFieldAccess
    : IDENTIFIER ('.' IDENTIFIER)+
    ;

assignmentOperator
    : '='
    | ADD_ASSIGN
    | SUB_ASSIGN
    ;

// Foreach loop over an iterable (currently just expressions).
// Example: f0r34ch(v4l 1n c0ll3ct10n) { pr1nt(v4l) }
foreachStatement
    : FOREACH_KW '(' IDENTIFIER IN_KW expression ')' block
    ;

// Break statement for exiting loops.
breakStatement
    : BREAK_KW
    ;

// Continue statement for skipping to next loop iteration.
continueStatement
    : CONTINUE_KW
    ;

// Function declaration.
// The optional returnTypeAnnotation lets functions declare return types.
// Example: funct1on add4(x4: iHNtSZ): iHNtSZ { r3turn x4 }
// CHANGE: Added EXPORT_KW? to this declaration
functionDeclaration
    : EXPORT_KW? FUNCTION_KW IDENTIFIER '(' parameterList? ')' returnTypeAnnotation? block
    ;

functionMainDeclaration
    : FUNCTION_KW MAIN_KW '(' ')' block
    ;

// Comma-separated function parameters.
parameterList
    : parameter (',' parameter)*
    ;

// A parameter can optionally include a TypeScript-style type annotation.
parameter
    : IDENTIFIER typeAnnotation?
    ;

// Return statement.
// The expression is optional so both "return" and "return value" are possible.
returnStatement
    : RETURN_KW expression?
    ;

// A block creates a grouped list of statements.
block
    : '{' statement* '}'
    ;

// Comma-separated function call arguments.
argumentList
    : expression (',' expression)*
    ;

// Function call expression.
functionCall
    : IDENTIFIER '(' argumentList? ')'
    ;

// TypeScript-inspired type annotation.
// Used by variables and parameters.
typeAnnotation
    : ':' dataType ('[' ']')?
    ;

// Function return type annotation.
// Void is allowed here because functions can return no value.
returnTypeAnnotation
    : ':' returnDataType
    ;

// Data types valid for values.
// IDENTIFIER supports user-defined/custom types later.
dataType
    : INT_KW
    | FLOAT_KW
    | STRING_KW
    | CHAR_KW
    | BOOLEAN_KW
    | IDENTIFIER
    ;

// Data types valid for function return values.
returnDataType
    : dataType
    | VOID_KW
    ;

// Expressions are values or computations with proper operator precedence.
// Precedence (highest to lowest): unary minus, MUL/DIV, ADD/SUB, comparison
// CHANGE: SHL, SHR, BWA, BWO
expression
    : NOT_KW expression
    | SUB expression
    | expression op=(MUL|DIV|MOD) expression
    | expression op=(ADD|SUB) expression
    | expression op=(SHL|SHR) expression
    | expression op=(EQ|NEQ|LT|GT|LTE|GTE) expression
    | expression op=(BWA|BWO) expression
    | expression op=(AND_KW|OR_KW) expression
    | '(' expression ')'
    | functionCall
    | recordLiteral
    | arrayLiteral
    | arrayIndexAccess
    | expression '.' IDENTIFIER
    | NUMBER
    | FLOAT
    | STRING
    | TRUE_KW
    | FALSE_KW
    | IDENTIFIER
    ;

// CHANGE: Added include keyword
// Jejemonized "include".
// Examples: iHNcHLuHD3s, IhnChlUhdeZ
INCLUDE_KW
    : LOWER_I UPPER_H UPPER_N LOWER_C UPPER_H UPPER_L LOWER_U UPPER_H UPPER_D UPPER_E LOWER_PLURAL+
    | UPPER_I LOWER_H LOWER_N UPPER_C LOWER_H LOWER_L UPPER_U LOWER_H LOWER_D LOWER_E UPPER_PLURAL+
    ;

// Jejemonized "const".
// H may be inserted after the first letter for Grammar.md-style spelling.
// At least one important marker must be jejemon, such as 0 or plural Z/2/$/5.
// Examples: c0hNsTs, cH0hNsTs, CoHnStZ
CONST_KW
    : LOWER_C UPPER_O LOWER_H UPPER_N LOWER_S UPPER_T LOWER_PLURAL+
    | UPPER_C LOWER_O UPPER_H LOWER_N UPPER_S LOWER_T UPPER_PLURAL+
    ;

// Jejemonized "var".
// The optional H follows the style in Grammar.md, where h/H is often inserted.
// Examples: v4r, vh@rZ
VAR_KW
    : LOWER_V UPPER_H UPPER_A LOWER_R LOWER_PLURAL+
    | UPPER_V LOWER_H LOWER_A UPPER_R UPPER_PLURAL+
    ;

// Jejemonized "let".
// Examples: lH3ts, LheTZ
LET_KW
    : LOWER_L UPPER_H UPPER_E LOWER_T LOWER_PLURAL+ 
    | UPPER_L LOWER_H LOWER_E UPPER_T UPPER_PLURAL+
    ;

// Jejemonized "print".
// H may be inserted after the first letter.
// Examples: pHR!HNTs
PRINT_KW
    : LOWER_P UPPER_H UPPER_R LOWER_I UPPER_H UPPER_N UPPER_T LOWER_PLURAL+
    | UPPER_P LOWER_H LOWER_R UPPER_I LOWER_H LOWER_N LOWER_T UPPER_PLURAL+
    ;

// Jejemonized "scan".
// Examples: scH4nz, SCh@NS
SCAN_KW
    : LOWER_S LOWER_C UPPER_H UPPER_A LOWER_N LOWER_PLURAL+
    | UPPER_S UPPER_C LOWER_H LOWER_A UPPER_N UPPER_PLURAL+
    ;

// Jejemonized "if".
// H may be inserted after the first letter.
// Examples: !f, !Hf, 1fZ
IF_KW
    : LOWER_I UPPER_H UPPER_F LOWER_PLURAL+
    | UPPER_I LOWER_H LOWER_F UPPER_PLURAL+
    ;

// Jejemonized "else".
// H may be inserted after the first letter.
// Examples: 3lse, 3hlse, els3, elseZ
ELSE_KW
    : LOWER_E UPPER_H UPPER_L UPPER_S UPPER_E LOWER_PLURAL+
    | UPPER_E LOWER_H LOWER_L LOWER_S LOWER_E UPPER_PLURAL+
    ;

// Jejemonized "while".
// Examples: wh1le, whil3, whileZ
WHILE_KW
    : LOWER_W UPPER_H UPPER_I LOWER_L UPPER_E LOWER_PLURAL+
    | UPPER_W LOWER_H LOWER_I UPPER_L LOWER_E UPPER_PLURAL+
    ;

// Jejemonized "function".
// H may be inserted after the first letter.
// Examples: funct1on, fHuncti0n, functionZ
FUNCTION_KW
    : LOWER_F UPPER_H UPPER_U LOWER_N LOWER_C UPPER_T UPPER_H LOWER_I UPPER_O UPPER_N LOWER_PLURAL+
    | UPPER_F LOWER_H LOWER_U UPPER_N UPPER_C LOWER_T LOWER_H UPPER_I LOWER_O LOWER_N UPPER_PLURAL+
    ;

// Jejemonized "return".
// H may be inserted after the first letter.
// Examples: r3turn, rH3turn, returnZ
RETURN_KW
    : LOWER_R UPPER_H UPPER_E LOWER_T UPPER_H UPPER_U LOWER_R LOWER_N LOWER_PLURAL+
    | UPPER_R LOWER_H LOWER_E UPPER_T LOWER_H LOWER_U UPPER_R UPPER_N UPPER_PLURAL+
    ;

// Jejemonized "do".
// Examples: d0, d0z
DO_KW
    : LOWER_D UPPER_H UPPER_O LOWER_PLURAL+
    | UPPER_D LOWER_H LOWER_O UPPER_PLURAL+
    ;

// Jejemonized "for".
// H may be inserted after the first letter.
// Examples: f0r, fHor, forZ
FOR_KW
    : LOWER_F UPPER_H UPPER_O LOWER_R LOWER_PLURAL+
    | UPPER_F LOWER_H LOWER_O UPPER_R UPPER_PLURAL+
    ;

// Jejemonized "foreach".
// H may be inserted after the first letter.
// Examples: f0r34ch, fHor34ch, foreachZ
FOREACH_KW
    : LOWER_F UPPER_H UPPER_O LOWER_R UPPER_E UPPER_A LOWER_C UPPER_H LOWER_PLURAL+
    | UPPER_F LOWER_H LOWER_O UPPER_R LOWER_E LOWER_A UPPER_C LOWER_H UPPER_PLURAL+
    ;

// Jejemonized "in".
// Examples: 1n, !n, inZ
IN_KW
    : LOWER_I UPPER_H UPPER_N LOWER_PLURAL+
    | UPPER_I LOWER_H LOWER_N UPPER_PLURAL+
    ;

// Jejemonized "break".
// H may be inserted after the first letter.
// Examples: br34k, brh3ak, breakZ
BREAK_KW
    : LOWER_B UPPER_H UPPER_R UPPER_E LOWER_A UPPER_H UPPER_K LOWER_PLURAL+
    | UPPER_B LOWER_H LOWER_R LOWER_E UPPER_A LOWER_H LOWER_K UPPER_PLURAL+
    ;

// Jejemonized "continue".
// H may be inserted after the first letter.
// Examples: c0nt1nu3, cHont1nu3, continueZ
CONTINUE_KW
    : LOWER_C UPPER_O UPPER_H LOWER_N LOWER_T UPPER_H UPPER_I LOWER_N UPPER_H UPPER_U UPPER_E LOWER_PLURAL+
    | UPPER_C LOWER_O LOWER_H UPPER_N UPPER_T LOWER_H LOWER_I UPPER_N LOWER_H LOWER_U LOWER_E UPPER_PLURAL+
    ;

// Jejemonized primitive type "int".
// Examples: iHNtSZ, IhnTsz, 1nt
INT_KW
    : LOWER_I UPPER_H UPPER_N LOWER_T UPPER_PLURAL+
    | UPPER_I LOWER_H LOWER_N UPPER_T LOWER_PLURAL+
    ;

// Jejemonized primitive type "float".
// Examples: fHLoaTHsz, Fhl04thSZ, fl0at
FLOAT_KW
    : LOWER_F UPPER_H UPPER_L LOWER_O LOWER_A UPPER_T UPPER_H LOWER_PLURAL+
    | UPPER_F LOWER_H LOWER_L UPPER_O UPPER_A LOWER_T LOWER_H UPPER_PLURAL+
    ;

// Jejemonized primitive type "string".
// H may be inserted after the first letter.
// Examples: sTRh1Ngz, StrHinGS
STRING_KW
    : LOWER_S UPPER_T UPPER_R LOWER_H UPPER_I UPPER_N LOWER_G LOWER_PLURAL+
    | UPPER_S LOWER_T LOWER_R UPPER_H LOWER_I LOWER_N UPPER_G UPPER_PLURAL+
    ;

// Jejemonized primitive type "char".
// Examples: cH4rHz, ChaRhS, ch4r
CHAR_KW
    : LOWER_C UPPER_H UPPER_A LOWER_R UPPER_H LOWER_PLURAL+
    | UPPER_C LOWER_H LOWER_A UPPER_R LOWER_H UPPER_PLURAL+
    ;

// Jejemonized primitive type "boolean".
// Examples: bH0oHLeaNs, Bho0hl3AnZ
BOOLEAN_KW
    : LOWER_B UPPER_H UPPER_O LOWER_O UPPER_H UPPER_L LOWER_E LOWER_A UPPER_N LOWER_PLURAL+
    | UPPER_B LOWER_H LOWER_O UPPER_O LOWER_H LOWER_L UPPER_E UPPER_A LOWER_N UPPER_PLURAL+
    ;

// CHANGE: Added True and False keywords
// Jejemonized keyword "true".
// Examples: tRueHz, TrU3hS
TRUE_KW
    : LOWER_T UPPER_R LOWER_U LOWER_E UPPER_H LOWER_PLURAL+
    | UPPER_T LOWER_R UPPER_U UPPER_E LOWER_H UPPER_PLURAL+
    ;

// Jejemonized keyword "false".
// Examples: fHAls3z, FhaLSeS
FALSE_KW
    : LOWER_F UPPER_H UPPER_A LOWER_L LOWER_S UPPER_E LOWER_PLURAL+
    | UPPER_F LOWER_H LOWER_A UPPER_L UPPER_S LOWER_E UPPER_PLURAL+
    ;

// Jejemonized primitive return type "void".
// Examples: vH0iDs, Vho1dZ, v0id
VOID_KW
    : LOWER_V UPPER_H UPPER_O LOWER_I UPPER_D LOWER_PLURAL+
    | UPPER_V LOWER_H LOWER_O UPPER_I LOWER_D UPPER_PLURAL+
    ;

// CHANGE: Added Main Keyword
// Jejemonized primitive return type "void".
// Examples: mHA1Ns, MhainZ
MAIN_KW
    : LOWER_M UPPER_H UPPER_A UPPER_I UPPER_N LOWER_PLURAL+
    | UPPER_M LOWER_H LOWER_A LOWER_I LOWER_N UPPER_PLURAL+
    ;

// CHANGE: Added Record and New Keyword
// Jejemonized primitive type "record"
// Examples: rH3cH0rHDz, RheChoRhds
RECORD_KW
    : LOWER_R UPPER_H UPPER_E LOWER_C UPPER_H UPPER_O LOWER_R UPPER_H UPPER_D LOWER_PLURAL+
    | UPPER_R LOWER_H LOWER_E UPPER_C LOWER_H LOWER_O UPPER_R LOWER_H LOWER_D UPPER_PLURAL+
    ;

// Examples: nHEWs, NhewZ
NEW_KW
    : LOWER_N UPPER_H UPPER_E UPPER_W LOWER_PLURAL+
    | UPPER_N LOWER_H LOWER_E LOWER_W UPPER_PLURAL+
    ;

// CHANGE: Added export keyword
// Examples: eHXpH0RTz, EhxPhortS
EXPORT_KW
    : LOWER_E UPPER_H UPPER_X LOWER_P UPPER_H UPPER_O UPPER_R UPPER_T LOWER_PLURAL+
    | UPPER_E LOWER_H LOWER_X UPPER_P LOWER_H LOWER_O LOWER_R LOWER_T UPPER_PLURAL+
    ;

// Examples: nH0ts, NhoTZ
NOT_KW
    : LOWER_N UPPER_H UPPER_O LOWER_T LOWER_PLURAL+
    | UPPER_N LOWER_H LOWER_O UPPER_T UPPER_PLURAL+
    ;

// Examples: aHNdz, AhnDS
AND_KW
    : LOWER_A UPPER_H UPPER_N LOWER_D LOWER_PLURAL+
    | UPPER_A LOWER_H LOWER_N UPPER_D UPPER_PLURAL+
    ;

// Examples: oHRz, 0hrS
OR_KW
    : LOWER_O UPPER_H UPPER_R LOWER_PLURAL+
    | UPPER_O LOWER_H LOWER_R UPPER_PLURAL+
    ;

// Identifiers must contain at least one jejemon marker.
// This prevents plain variable names like "count" and accepts names like "c0unt".
IDENTIFIER
    : WORD
    ;

// CHANGE: Added filename and file extension
FILENAME
    : LETTER+ '.' FILE_EXTENSION
    ;

FILE_EXTENSION
    : 'stg'
    ;

LINE_COMMENT
    : '//' ~[\r\n]* -> channel(HIDDEN)
    ;

BLOCK_COMMENT
    : '/*' .*? '*/' -> channel(HIDDEN)
    ;

// Arithmetic operators.
ADD_ASSIGN: '+=';
SUB_ASSIGN: '-=';
ADD: '+';
SUB: '-';
MUL: '*';
DIV: '/';
MOD: '%';

// Comparison operators.
EQ: '==';
NEQ: '!=';
LT: '<';
GT: '>';
LTE: '<=';
GTE: '>=';
SHL: '<<';
SHR: '>>';
BWA: '&';
BWO: '|';

SEMICOLON: ';';

// Basic literals.
// CHANGE: Added float literal
FLOAT: NUMBER+ '.' 
    | '.' NUMBER+
    | NUMBER+ '.' NUMBER
    ;
NUMBER: [0-9]+;
STRING: '"' .*? '"';

// Whitespace is ignored by the parser.
WS: [ \t\r\n]+ -> skip;

// CHANGE: Change this to fragment since it's building the tokens
fragment WORD: WORD_BLOCK+;
    
fragment WORD_BLOCK
    : SYLLABLE_LOWCASE+ LOWER_PLURAL+ UNDERSCORE* 
    | SYLLABLE_UPCASE+ UPPER_PLURAL+ UNDERSCORE*
    ;

fragment SYLLABLE_LOWCASE: LOWER_CASE UPPER_H UPPER_CASE*;
fragment SYLLABLE_UPCASE: UPPER_CASE LOWER_H LOWER_CASE*;

fragment LETTER: LOWER_CASE | UPPER_CASE;

// Plain letter fragments used to compose keyword tokens.
fragment UNDERSCORE: '_';
fragment LOWER_A: [a@];
fragment UPPER_A: [A4];
fragment LOWER_B: [b];
fragment UPPER_B: [B8];
fragment LOWER_C: [c];
fragment UPPER_C: [C];
fragment LOWER_D: [d];
fragment UPPER_D: [D];
fragment LOWER_E: [e];
fragment UPPER_E: [E3];
fragment LOWER_F: [f];
fragment UPPER_F: [F];
fragment LOWER_G: [g9];
fragment UPPER_G: [G];
fragment LOWER_H: [h];
fragment UPPER_H: [H];
fragment LOWER_I: [i!];
fragment UPPER_I: [I1];
fragment LOWER_J: [j];
fragment UPPER_J: [J];
fragment LOWER_K: [k];
fragment UPPER_K: [K];
fragment LOWER_L: [l];
fragment UPPER_L: [L];
fragment LOWER_M: [m];
fragment UPPER_M: [M];
fragment LOWER_N: [n];
fragment UPPER_N: [N];
fragment LOWER_O: [o];
fragment UPPER_O: [O0];
fragment LOWER_P: [p];
fragment UPPER_P: [P];
fragment LOWER_Q: [q];
fragment UPPER_Q: [Q];
fragment LOWER_R: [r];
fragment UPPER_R: [R];
fragment LOWER_S: [s];
fragment UPPER_S: [S5$];
fragment LOWER_T: [t];
fragment UPPER_T: [T];
fragment LOWER_U: [u];
fragment UPPER_U: [U];
fragment LOWER_V: [v];
fragment UPPER_V: [V];
fragment LOWER_W: [w];
fragment UPPER_W: [W];
fragment LOWER_X: [x];
fragment UPPER_X: [X];
fragment LOWER_Y: [y];
fragment UPPER_Y: [Y];
fragment LOWER_Z: [z];
fragment UPPER_Z: [Z2];

// Plural suffixes create the classic trailing s/z/S/Z/2/$/5 style.
// PLURAL accepts any suffix.
fragment LOWER_PLURAL: LOWER_S | LOWER_Z;
fragment UPPER_PLURAL: UPPER_S | UPPER_Z;

fragment LOWER_CASE: [a-z] | LOWER_A | LOWER_G | LOWER_I;
fragment UPPER_CASE: [A-Z] | UPPER_A | UPPER_B | UPPER_E | UPPER_I | UPPER_O | UPPER_S | UPPER_Z;
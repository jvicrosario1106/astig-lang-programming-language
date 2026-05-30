grammar AstigLang;

// Entry point of the language.
// A program is currently any number of statements until the end of file.
program: statement* EOF;

// All valid top-level or block-level statements.
// Add new language features here when they should behave like statements.
statement
    : variableDeclaration
    | printStatement
    | ifStatement
    | whileStatement
    | functionDeclaration
    | returnStatement
    | block
    ;

// Variable declaration syntax.
// The declaration keyword must be a jejemonized const/var/let keyword.
// Type annotations are optional for now, inspired by TypeScript.
// Examples: v4r x4 = 10, v4r x4: iHNtSZ = 10
variableDeclaration
    : declarationKeyword IDENTIFIER typeAnnotation? '=' expression
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

// If statement with an optional else block.
// IF_KW and ELSE_KW are jejemonized "if" and "else".
ifStatement
    : IF_KW '(' expression ')' block (ELSE_KW block)?
    ;

// While loop.
// WHILE_KW is a jejemonized form of "while".
whileStatement
    : WHILE_KW '(' expression ')' block
    ;

// Function declaration.
// The optional returnTypeAnnotation lets functions declare return types.
// Example: funct1on add4(x4: iHNtSZ): iHNtSZ { r3turn x4 }
functionDeclaration
    : FUNCTION_KW IDENTIFIER '(' parameterList? ')' returnTypeAnnotation? block
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
    : ':' dataType
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

// Expressions are values or computations.
// This is still simple: calls, numbers, strings, and identifiers.
expression
    : functionCall
    | NUMBER
    | STRING
    | IDENTIFIER
    ;

// Jejemonized "const".
// H may be inserted after the first letter for Grammar.md-style spelling.
// At least one important marker must be jejemon, such as 0 or plural Z/2/$/5.
// Examples: c0hNsTs, cH0hNsTs, CoHnStZ
CONST_KW
    : C H? O_J H? N S T PLURAL
    | C H? O_ANY H? N S T PLURAL_J
    ;

// Jejemonized "var".
// The optional H follows the style in Grammar.md, where h/H is often inserted.
// Examples: v4r, vh@rZ
VAR_KW
    : V H? A_J R PLURAL?
    | V H? A_ANY R PLURAL_J
    ;

// Jejemonized "let".
// Examples: l3t, lhEtZ
LET_KW
    : L H? E_J T PLURAL?
    | L H? E_ANY T PLURAL_J
    ;

// Jejemonized "print".
// H may be inserted after the first letter.
// Examples: pr1nt, pHr!nt, printZ
PRINT_KW
    : P H? R I_J N T PLURAL?
    | P H? R I_ANY N T PLURAL_J
    ;

// Jejemonized "if".
// H may be inserted after the first letter.
// Examples: !f, !Hf, 1fZ
IF_KW
    : I_J H? F PLURAL?
    | I_ANY H? F PLURAL_J
    ;

// Jejemonized "else".
// H may be inserted after the first letter.
// Examples: 3lse, 3hlse, els3, elseZ
ELSE_KW
    : E_J H? L S E_ANY PLURAL?
    | E_ANY H? L S E_J PLURAL?
    | E_ANY H? L S E_ANY PLURAL_J
    ;

// Jejemonized "while".
// Examples: wh1le, whil3, whileZ
WHILE_KW
    : W H I_J L E_ANY PLURAL?
    | W H I_ANY L E_J PLURAL?
    | W H I_ANY L E_ANY PLURAL_J
    ;

// Jejemonized "function".
// H may be inserted after the first letter.
// Examples: funct1on, fHuncti0n, functionZ
FUNCTION_KW
    : F H? U N C T I_J O_ANY N PLURAL?
    | F H? U N C T I_ANY O_J N PLURAL?
    | F H? U N C T I_ANY O_ANY N PLURAL_J
    ;

// Jejemonized "return".
// H may be inserted after the first letter.
// Examples: r3turn, rH3turn, returnZ
RETURN_KW
    : R H? E_J T U R N PLURAL?
    | R H? E_ANY T U R N PLURAL_J
    ;

// Jejemonized primitive type "int".
// Examples: iHNtSZ, IhnTsz, 1nt
INT_KW
    : I_J H? N T PLURAL?
    | I_ANY H? N T PLURAL_J
    ;

// Jejemonized primitive type "float".
// Examples: fHLoaTHsz, Fhl04thSZ, fl0at
FLOAT_KW
    : F H? L O_J A_ANY T H? PLURAL?
    | F H? L O_ANY A_J T H? PLURAL?
    | F H? L O_ANY A_ANY T H? PLURAL_J
    ;

// Jejemonized primitive type "string".
// H may be inserted after the first letter.
// Examples: sTRh1Ngz, sHtr1ng, StrHinGS
STRING_KW
    : S H? T R H? I_J N G PLURAL?
    | S H? T R H? I_ANY N G PLURAL_J
    ;

// Jejemonized primitive type "char".
// Examples: cH4rHz, ChaRhS, ch4r
CHAR_KW
    : C H? A_J R H? PLURAL?
    | C H? A_ANY R H? PLURAL_J
    ;

// Jejemonized primitive type "boolean".
// H may be inserted after the first letter.
// Examples: b0olean, bH0olean, boole@n, booleanZ
BOOLEAN_KW
    : B H? O_J O_ANY L E_ANY A_ANY N PLURAL?
    | B H? O_ANY O_J L E_ANY A_ANY N PLURAL?
    | B H? O_ANY O_ANY L E_J A_ANY N PLURAL?
    | B H? O_ANY O_ANY L E_ANY A_J N PLURAL?
    | B H? O_ANY O_ANY L E_ANY A_ANY N PLURAL_J
    ;

// Jejemonized primitive return type "void".
// Examples: vH0iDs, Vho1dZ, v0id
VOID_KW
    : V H? O_J I_ANY D PLURAL?
    | V H? O_ANY I_J D PLURAL?
    | V H? O_ANY I_ANY D PLURAL_J
    ;

// Identifiers must contain at least one jejemon marker.
// This prevents plain variable names like "count" and accepts names like "c0unt".
IDENTIFIER
    : [a-zA-Z_@!] [a-zA-Z0-9_@!]* JEJE_MARK [a-zA-Z0-9_@!]*
    | [@!] [a-zA-Z0-9_@!]*
    | [4021] [a-zA-Z_@!] [a-zA-Z0-9_@!]*
    ;

// Basic literals.
NUMBER: [0-9]+;
STRING: '"' .*? '"';

// Whitespace is ignored by the parser.
WS: [ \t\r\n]+ -> skip;

// Any character that marks a word as jejemonized.
fragment JEJE_MARK: [4@01!2];

// Letter fragments ending with _ANY accept normal or jejemon forms.
// Letter fragments ending with _J require the jejemon form.
fragment A_ANY: [aA4@];
fragment A_J: [4@];
fragment E_ANY: [eE3];
fragment E_J: [3];
fragment I_ANY: [iI1!];
fragment I_J: [1!];

// Plain letter fragments used to compose keyword tokens.
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment K: [kK];
fragment L: [lL];
fragment N: [nN];
fragment O_ANY: [oO0];
fragment O_J: [0];
fragment P: [pP];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];

// Plural suffixes create the classic trailing s/z/S/Z/2/$/5 style.
// PLURAL accepts any suffix; PLURAL_J requires a jejemon-looking suffix.
fragment PLURAL: [sSzZ2$5]+;
fragment PLURAL_J: [sS]* [zZ2$5] [sSzZ2$5]*;

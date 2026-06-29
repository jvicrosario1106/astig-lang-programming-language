## Task List

### Grammar / Parser

- [x] Support `include` directives and file-level program structure
- [x] Support `main` function structure and program entry point syntax
- [x] Add `const` declaration syntax separate from variable declarations
- [x] Add assignment statements independent of declarations
- [x] Add `if`, `else if`, and `else` chain syntax
- [x] Add `while`, `for`, `do-while`, and `foreach` syntax
- [ ] Add full expression grammar for:
  - [x] arithmetic operators (`+`, `-`, `*`, `/`)
  - [ ] modulus operator (`%`)
  - [x] relational operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
  - [ ] logical operators (`&&`, `||`, `!`)
  - [x] unary operators and parenthesized expressions
  - [x] boolean literals and comparisons
- [ ] Add array literals and indexing syntax
- [x] Add record declarations, literals, and field access syntax
- [ ] Add user-defined type aliasing support
- [x] Add token rules for jejemonized keywords and identifiers
- [x] Define keywords and reserved words consistently (`print`, `if`, `else`, `while`, `for`, `do`, `function`, `return`, `const`, `var`, `let`, `include`, `record`, `main`, `export`, `true`, `false`)
- [x] Design operator precedence and associativity in grammar
- [x] Support parenthesized expressions and unary operators cleanly in the parser
- [ ] Add comments
- [x] Function call expressions

### AST / Semantic model

- [x] Build AST nodes for:
  - [x] `IfStatement` (with `elseIfChains` and `elseBranch` support)
  - [x] `WhileStatement`, `ForStatement`, `DoWhileStatement`, `ForeachStatement`
  - [x] `AssignmentStatement`, `ConstDeclaration`, `VariableDeclaration`
  - [x] `BreakStatement`, `ContinueStatement`
  - [x] `BinaryExpression`
  - [x] `UnaryExpression`
  - [x] `BooleanLiteral`, `RecordLiteral`, `MemberAccess`
  - [ ] `ArrayExpression`
- [x] Build type annotation nodes for variables, parameters, and function return types
- [x] Build function call AST nodes with argument lists
- [x] Build symbol table / scope model for declarations and lookups
- [x] Build AST for `main` program structure and module imports
- [x] Represent block scope and nested statements explicitly in the AST
- [ ] Keep AST node kinds minimal, composable, and easy to evaluate
- [x] block scope for `var`, `let`, and `const`
- [x] type mismatch checking

### Interpreter / Runtime

- [x] Implement runtime scopes for global, function, and block-level variables
- [x] Implement `const` immutability and `var`/`let` semantics
- [x] Implement assignment semantics separate from declaration
- [x] Execute `if / else if / else` chains correctly
- [x] Execute loop forms (`while`, `do-while`, `for`, `foreach`) and support `break` / `continue`
- [x] Evaluate arithmetic expressions
- [x] Evaluate relational expressions (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- [ ] Evaluate logical expressions and compound conditions
- [x] Evaluate boolean expressions and truthiness rules safely
- [x] Implement function definition, call, return, and parameter passing
- [x] Execute `print` statement
- [ ] Add input/read support
- [ ] Implement arrays runtime support
- [x] Implement records and structured data runtime support
- [x] Implement type checking for declarations, operations, and function return types
- [x] Add runtime error reporting for undefined names, type mismatches, and illegal operations
- [ ] Add parser/AST error recovery or user-friendly error messages
- [x] Keep the interpreter layered: parser → AST → type checker → evaluator → output
- [x] Keep `print` as a statement-level runtime feature, not an expression side effect
- [x] Plan runtime semantics for `const`, `var`, and `let` before adding functions and control flow
- [x] `.stg` separate files with `include` resolution
- [ ] Input / Output

### Project / specification coverage

- [x] Add sample programs covering statement types and expressions
- [ ] Add test cases for conditionals, loops, functions, and type behavior
- [ ] Add documentation of language syntax and examples
- [ ] Add intermediate code generation or IR if required by the final submission
- [ ] Add optimization passes or proof-of-concept transformations as bonus work
- [ ] Add debugger/trace output or execution visualization as bonus work
- [ ] Add pointer support as a bonus feature if time allows

### Scanner / Lexer

- [x] ANTLR-generated lexer (jejemon keywords and identifiers)
- [x] Token output with line and column attributes
- [x] Lexical error reporting and recovery messages
- [x] Scanner speed demo and file dumps (`scanner-output.txt`, `scanner-error-dump.txt`)
- [x] Five scanner sample programs (`scanner-demo-1.stg` … `5.stg`)
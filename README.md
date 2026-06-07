## Task List

### Grammar / Parser

- [ ] Support `include` directives and file-level program structure
- [ ] Support `main` function structure and program entry point syntax
- [x] Add `const` declaration syntax separate from variable declarations
- [x] Add assignment statements independent of declarations
- [x] Add `if`, `else if`, and `else` chain syntax
- [x] Add `while`, `for`, `do-while`, `repeat-until`, and `foreach` syntax
- [x] Add `break` and `continue` keywords for loop control
- [ ] Add full expression grammar for:
  - [x] arithmetic operators (`+`, `-`, `*`, `/`)
  - [ ] modulus operator (`%`)
  - [x] relational operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
  - [ ] logical operators (`&&`, `||`, `!`)
  - [x] unary operators and parenthesized expressions
  - [ ] boolean literals and comparisons
- [ ] Add array literals, indexing, and record access syntax
- [ ] Add user-defined type declarations and type aliasing support
- [ ] Add token rules for all jejemonized keywords and identifiers
- [ ] Define keywords and reserved words consistently (`print`, `if`, `else`, `while`, `for`, `do`, `repeat`, `until`, `function`, `return`, `const`, `var`, `let`)
- [x] Design operator precedence and associativity in grammar
- [x] Support parenthesized expressions and unary operators cleanly in the parser
- [ ] Finalize Grammar
- [ ] Add comments
- [ ] Function Call multilple times

### AST / Semantic model

- [ ] Build AST nodes for:
  - [x] `IfStatement` (with `elseIfChains` and `elseBranch` support)
  - `WhileStatement`, `ForStatement`, `DoWhileStatement`, `RepeatUntilStatement`, `ForeachStatement`
  - [x] `AssignmentStatement`, `ConstDeclaration`, `VariableDeclaration`
  - [x] `BreakStatement`, `ContinueStatement`
  - [x] `BinaryExpression`
  - [x] `UnaryExpression`
  - `BooleanLiteral`, `ArrayExpression`, `RecordExpression`
- [x] Build type annotation nodes for variables, parameters, and function return types
- [x] Build function call AST nodes with argument lists
- [x] Build symbol table / scope model for declarations and lookups
- [ ] Build AST for `main` program structure and module imports
- [x] Represent block scope and nested statements explicitly in the AST
- [ ] Keep AST node kinds minimal, composable, and easy to evaluate
- [ ] var block scope
- [ ] type mismatch
- [ ] Error Catching for misspelling
  - [ ] No plural for a keyword
  - [ ] No plural for an identifier
  - [ ] No upper or lower H for a keyword
  - [ ] No upper or lower H for an identifier

### Interpreter / Runtime

- [x] Implement runtime scopes for global, function, and block-level variables
- [x] Implement `const` immutability and `var`/`let` semantics
- [x] Implement assignment semantics separate from declaration
- [x] Execute `if / else if / else` chains correctly
- [ ] Execute all loop forms and support `break` / `continue`
- [x] Evaluate arithmetic expressions
- [x] Evaluate relational expressions (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- [ ] Evaluate logical expressions and compound conditions
- [x] Evaluate boolean expressions and truthiness rules safely
- [x] Implement function definition, call, return, and parameter passing
- [ ] Execute `print` and add input/read support if required by spec
- [ ] Implement arrays, records, and basic structured data runtime support
- [ ] Implement type checking for declarations, operations, and function return types
- [ ] Add runtime error reporting for undefined names, type mismatches, and illegal operations
- [ ] Add parser/AST error recovery or user-friendly error messages
- [ ] Keep the interpreter layered: parser → AST → evaluator → output
- [ ] Keep `print` as a statement-level runtime feature, not an expression side effect
- [x] Plan runtime semantics for `const`, `var`, and `let` before adding functions and control flow
- [ ] var block scope
- [ ] .stg separate file for code
- [ ] Input / Output

### Project / specification coverage

- [x] Add sample programs covering all statement types and expressions
- [ ] Add test cases for conditionals, loops, functions, and type behavior
- [ ] Add documentation of language syntax and examples
- [ ] Add intermediate code generation or IR if required by the final submission
- [ ] Add optimization passes or proof-of-concept transformations as bonus work
- [ ] Add debugger/trace output or execution visualization as bonus work
- [ ] Add pointer support as a bonus feature if time allows

## Needs Improvement

- AST builder needs explicit support for if/else-if/else chain nesting and conditional expressions
- Interpreter needs proper control-flow evaluation for all statement constructs
- Grammar needs richer expression rules and operator precedence handling
- Runtime currently lacks type checking, structured data, and error recovery
- Function call and return semantics need complete support in AST/runtime
- Need to align current implementation with `Grammar.md` and `Specifications.md` more closely
- Need dedicated tests for every new syntax and runtime feature

<!-- ### Known gaps in current implementation

- `if` statements are parsed by grammar, but AST builder and interpreter do not support them fully
- `while` statements are parsed by grammar, but AST builder and interpreter do not support them
- function call evaluation is not implemented in the interpreter
- `FunctionDeclaration` bodies are not executed as callable functions
- `ReturnStatement` handling is not implemented in function execution
- no support for binary operators, boolean logic, or relational expressions
- no support for `for`, `do-while`, `repeat-until`, `foreach` loops in current grammar or runtime
- no support for arrays, records, user-defined types, or pointers
- no error recovery layer beyond parser syntax error detection -->

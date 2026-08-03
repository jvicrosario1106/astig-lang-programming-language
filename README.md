# AstigLang

Jejemon-styled programming language (`.stg` files). Pipeline: **lexer → parser → AST → type checker → interpreter**.

```bash
npm run generate          # regenerate ANTLR lexer/parser from grammar/AstigLang.g4
npm start -- program.stg  # run a program file
npm start                 # REPL: type code, empty line to run, repeat
npm run pipeline          # pipeline demo → text-files/
npm run compile           # build standalone interpreter binary → binaries/
```

**Submission binary:** run `npm run compile`, then use `./binaries/astiglang program.stg` or `./binaries/astiglang` to type code interactively. See `binaries/README.md`.

Docs: `LANGUAGE.md` (manual), `SYNTAX-RULES.md` (do / don't reference), `Pipeline.md` (compiler pipeline).  
Demos: `demo-examples/`.

---

## Task List

### Grammar / Parser

- [x] Support `include` directives and file-level program structure
- [x] Support `main` function structure and program entry point syntax
- [x] Add `const` declaration syntax separate from variable declarations
- [x] Add assignment statements independent of declarations
- [x] Add `if`, `else if`, and `else` chain syntax
- [x] Add `while`, `for`, `do-while`, and `foreach` syntax
- [x] Add full expression grammar for:
  - [x] arithmetic operators (`+`, `-`, `*`, `/`)
  - [x] modulus operator (`%`)
  - [x] relational operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
  - [x] logical operators (`nH0ts` / `aHNdz` / `0hrS` — jejemon NOT / AND / OR, not ASCII `&&` `\|\|` `!`)
  - [x] unary operators and parenthesized expressions
  - [x] boolean literals and comparisons
- [ ] Add array literals and indexing syntax *(partial: primitive arrays `iHNtSZ[]`, literals, index read/assign; arrays of records not supported)*
- [x] Add record declarations, literals, and field access syntax
- [ ] Add user-defined type aliasing support
- [x] Add token rules for jejemonized keywords and identifiers
- [x] Define keywords and reserved words consistently (`print`, `scan`, `if`, `else`, `while`, `for`, `do`, `function`, `return`, `const`, `var`, `let`, `include`, `record`, `main`, `export`, `true`, `false`)
- [x] Design operator precedence and associativity in grammar
- [x] Support parenthesized expressions and unary operators cleanly in the parser
- [x] Add comments (`//` line, `/* */` block)
- [x] Function call expressions
- [x] Add `scan` statement (`scH4nz`) — optional string prompt + variable name

### AST / Semantic model

- [x] Build AST nodes for:
  - [x] `IfStatement` (with `elseIfChains` and `elseBranch` support)
  - [x] `WhileStatement`, `ForStatement`, `DoWhileStatement`, `ForeachStatement`
  - [x] `AssignmentStatement`, `ConstDeclaration`, `VariableDeclaration`
  - [x] `BreakStatement`, `ContinueStatement`
  - [x] `BinaryExpression`
  - [x] `UnaryExpression`
  - [x] `BooleanLiteral`, `RecordLiteral`, `MemberAccess`
  - [x] `ArrayLiteral`, `ArrayIndexAccess` *(primitive arrays)*
  - [x] `ScanStatement`
  - [x] `ArrayIndexAssignment`
- [x] Build type annotation nodes for variables, parameters, and function return types
- [x] Build function call AST nodes with argument lists
- [x] Build symbol table / scope model for declarations and lookups
- [x] Build AST for `main` program structure and module imports
- [x] Represent block scope and nested statements explicitly in the AST
- [ ] Keep AST node kinds minimal, composable, and easy to evaluate *(ongoing design goal)*
- [x] block scope for `var`, `let`, and `const`
- [x] type mismatch checking
- [ ] Type-check `ArrayIndexAssignment` *(runtime works; static check not wired yet)*

### Interpreter / Runtime

- [x] Implement runtime scopes for global, function, and block-level variables
- [x] Implement `const` immutability and `var`/`let` semantics *(both block-scoped; only `const` is immutable)*
- [x] Implement assignment semantics separate from declaration
- [x] Execute `if / else if / else` chains correctly
- [x] Execute loop forms (`while`, `do-while`, `for`, `foreach`) and support `break` / `continue`
- [x] Evaluate arithmetic expressions
- [x] Evaluate relational expressions (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- [x] Evaluate logical expressions and compound conditions (`nH0ts`, `aHNdz`, `0hrS`)
- [x] Evaluate boolean expressions and truthiness rules safely
- [x] Implement function definition, call, return, and parameter passing
- [x] Execute `print` statement (`pHR!HNTs`) — output via expression
- [x] Add input/read support — `scan` (`scH4nz`) reads stdin into a variable with type coercion
- [ ] Implement arrays runtime support *(partial: primitive arrays only)*
- [x] Implement records and structured data runtime support
- [x] Implement type checking for declarations, operations, and function return types
- [x] Type-check `scan` (variable must exist, not `const`, scannable scalar type)
- [x] Add runtime error reporting for undefined names, type mismatches, and illegal operations
- [x] Add parser/AST error recovery or user-friendly error messages *(lex/parse diagnostics, type-check multi-error recovery, `type-errors-multi.stg` demo)*
- [x] Keep the interpreter layered: parser → AST → type checker → evaluator → output
- [x] Keep `print` as a statement-level runtime feature, not an expression side effect
- [x] Plan runtime semantics for `const`, `var`, and `let` before adding functions and control flow
- [x] `.stg` separate files with `include` resolution
- [x] Input / Output (`scan` = input, `print` = output)

### Project / specification coverage

- [x] Add sample programs covering statement types and expressions (`demo-examples/`)
- [ ] Add test cases for conditionals, loops, functions, and type behavior *(manual `.stg` demos only; `npm test` is a stub)*
- [ ] Add documentation of language syntax and examples *(partial: `LANGUAGE.md` + `SYNTAX-RULES.md` exist; some sections lag behind latest grammar)*
- [ ] Add intermediate code generation or IR if required by the final submission
- [ ] Add optimization passes or proof-of-concept transformations as bonus work
- [ ] Add debugger/trace output or execution visualization as bonus work
- [ ] Add pointer support as a bonus feature if time allows

### Scanner / Lexer

- [x] ANTLR-generated lexer (jejemon keywords and identifiers)
- [x] Token output with line and column attributes
- [x] Lexical error reporting and recovery messages
- [x] Scanner speed demo and file dumps (`text-files/scanner-output.txt`, `text-files/scanner-error-dump.txt`)
- [x] Scanner demo programs (`language-showcase.stg`, `lexical-error.stg`)

### Parser / AST demo

- [x] Pipeline demo script (`npm run pipeline` → `text-files/`)
- [x] Demo sample programs (`math-simple-expression.stg`, `math-complex-expression.stg`, `logical-op-test.stg`, `array-test.stg`)

# AstigLang User Manual

**Version:** 1.0  
**Language:** AstigLang (`.stg` files)  
**Audience:** Programmers learning and writing AstigLang code

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [How a Program Is Structured](#3-how-a-program-is-structured)
4. [Jejemon Naming](#4-jejemon-naming)
5. [Keywords Quick Reference](#5-keywords-quick-reference)
6. [Types and Variables](#6-types-and-variables)
7. [Statements](#7-statements)
8. [Expressions and Operators](#8-expressions-and-operators)
9. [Control Flow](#9-control-flow)
10. [Functions](#10-functions)
11. [Records (Structures)](#11-records-structures)
12. [Arrays](#12-arrays)
13. [Pointers and Heap](#13-pointers-and-heap)
14. [Input and Output](#14-input-and-output)
15. [Includes and Export](#15-includes-and-export)
16. [Errors, Messaging, and Recovery](#16-errors-messaging-and-recovery)
17. [Compiler Pipeline](#17-compiler-pipeline)
18. [Do and Don't Quick Guide](#18-do-and-dont-quick-guide)
19. [Learning Path](#19-learning-path)

---

## 1. Introduction

**AstigLang** is a programming language with a **jejemon-styled** syntax. Every keyword and identifier uses special spellings instead of plain English.

Source files use the `.stg` extension.

When you run a program, the compiler goes through these steps:

```
Source → Lex + Parse → AST → Type Check → Optimize → Interpret → Output
```

You write code. The compiler checks it. Then it runs `main` and prints results.

---

## 2. Getting Started

### Install and run

```bash
npm install
npm run build
npm start -- path/to/program.stg
```

### Minimal program

Every entry file needs `main`:

```astig
fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("Hello, AstigLang!");
}
```

Run it:

```bash
npm start -- myprogram.stg
```

### Other useful commands

| Command | Purpose |
|---------|---------|
| `npm start -- file.stg` | Run a program |
| `npm start` | Interactive REPL (type code, empty line to run) |
| `npm run compile` | Build standalone binary in `binaries/` |
| `npm run pipeline` | Generate pipeline demo files in `text-files/` |

### Standalone binary (optional)

```bash
npm run compile
./binaries/astiglang program.stg
```

---

## 3. How a Program Is Structured

A `.stg` file is **not** a loose script. Top level must follow this order:

```
include*  →  record*  →  function*  →  main  →  end of file
```

| Section | Required? | Notes |
|---------|-----------|-------|
| Includes | No | Pull in library files |
| Records | No | User-defined types |
| Functions | No | Helper functions |
| `main` | **Yes** (entry file only) | Program starts here |

**Rule:** No executable statements at the top level. All code runs inside `main` or functions called from it.

### Full entry file example

```astig
iHNcHLuHD3s libHs.stg

rH3cH0rHDz gH4mH3s {
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz
}

fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns mHA1Ns() {
  vH4rs xH1s:iHNtSZ = aHDs(1, 2);
  pHR!HNTs(xH1s);
}
```

### Main rules

| Rule | Detail |
|------|--------|
| Entry file | Must have `fHUncTH!0Ns mHA1Ns() { ... }` |
| `main` position | Must be the **last** top-level item |
| `main` parameters | None allowed |
| `main` return type | None allowed |
| Library file | Must **not** have `main` |

### Comments

```astig
// Line comment

/* Block comment */
```

---

## 4. Jejemon Naming

AstigLang does **not** accept plain English names like `count`, `add`, or `print`.

### How jejemon works

- Letters are substituted: `0`→O, `1`→I, `3`→E, `4`→A, `8`→B
- `H` or `h` is often inserted inside words
- Identifiers usually end in `s` or `z`

### Valid examples

| Plain idea | Jejemon spelling |
|------------|------------------|
| name | `nH4mH3s` |
| count | `cH0uHNtHs` |
| x | `xH1s` |
| add (function) | `aHDs` |

### Invalid (will not compile)

```astig
var count = 10;        // plain English — lexical error
print("hello");        // use pHR!HNTs instead
function add() { }     // use fHUncTH!0Ns instead
```

---

## 5. Keywords Quick Reference

| Meaning | Jejemon spelling | Example |
|---------|------------------|---------|
| include | `iHNcHLuHD3s` | `iHNcHLuHD3s libHs.stg` |
| const | `c0hNsTz` | `c0hNsTz xH1s:iHNtSZ = 1` |
| var | `vH4rs` | `vH4rs xH1s:iHNtSZ = 1` |
| let | `lH3tsz` | `lH3tsz xH1s:iHNtSZ = 1` |
| print | `pHR!HNTs` | `pHR!HNTs(xH1s)` |
| scan | `scH4nz` | `scH4nz("Enter: ", xH1s)` |
| if | `!HFs` | `!HFs(xH1s > 0) { ... }` |
| else | `eHLSEs` | `eHLSEs { ... }` |
| else if | `eHLSEs !HFs` | `eHLSEs !HFs(xH1s == 0) { ... }` |
| while | `wH1lEs` | `wH1lEs(xH1s > 0) { ... }` |
| do | `dH0s` | `dH0s { ... } wH1lEs(xH1s > 0)` |
| for | `fH0rs` | `fH0rs(vH4rs i:iHNtSZ = 0; i < 5; i = i + 1) { ... }` |
| foreach | `fH0r34cHs` | `fH0r34cHs(cH4rH3s iHNs nH4mH3s) { ... }` |
| in | `iHNs` | used with foreach |
| function | `fHUncTH!0Ns` | `fHUncTH!0Ns aHDs(...):iHNtSZ { ... }` |
| main | `mHA1Ns` | `fHUncTH!0Ns mHA1Ns() { ... }` |
| return | `rH3tHUrns` | `rH3tHUrns xH1s` |
| break | `bHREaHKs` | `bHREaHKs` |
| continue | `c0nt1nu3s` | `c0nt1nu3s` |
| record | `rH3cH0rHDz` | `rH3cH0rHDz gH4mH3s { ... }` |
| new | `nHEWs` | `nHEWs gH4mH3s { sH0rH3s = 1 }` |
| export | `eHXpH0RTz` | `eHXpH0RTz fHUncTH!0Ns aHDs(...) { ... }` |
| true | `tRueHz` | `vH4rs x:bH0oHLeaNs = tRueHz` |
| false | `fHAls3z` | `pHR!HNTs(fHAls3z)` |

---

## 6. Types and Variables

### Built-in types

| Type | Spelling | Example |
|------|----------|---------|
| int | `iHNtSZ` | `vH4rs xH1s:iHNtSZ = 42` |
| float | `fHLoaTHsz` | `vH4rs fH1s:fHLoaTHsz = 3.14` |
| string | `sTRh1Ngz` | `vH4rs nH4mH3s:sTRh1Ngz = "Astig"` |
| char | `cH4rHz` | `vH4rs cH1s:cH4rHz = 'A'` |
| boolean | `bH0oHLeaNs` | `vH4rs fH1s:bH0oHLeaNs = tRueHz` |
| void | `vH0iDs` | return type only |
| int array | `iHNtSZ[]` | `lH3tsz aHs:iHNtSZ[] = [1, 2, 3]` |
| pointer | `iHNtSZ*` | `lH3tsz pH1s:iHNtSZ* = &xH1s` |
| record | user-defined name | `vH4rs pH1s:gH4mH3s = ...` |

**Type annotation is required** on every declaration:

```astig
vH4rs xH1s:iHNtSZ = 10;       // OK
vH4rs xH1s = 10;               // ERROR — missing type
```

### const, var, let

| Keyword | Meaning |
|---------|---------|
| `c0hNsTz` | Constant — cannot reassign or scan into |
| `vH4rs` | Variable — block-scoped, can reassign |
| `lH3tsz` | Variable — block-scoped, can reassign |

All three are **block-scoped**. A variable declared inside `{ }` is not visible outside.

```astig
fHUncTH!0Ns mHA1Ns() {
  vH4rs gH1s:iHNtSZ = 1;
  !HFs(tRueHz) {
    vH4rs xH1s:iHNtSZ = 99;    // only inside this block
    pHR!HNTs(xH1s);
  }
  pHR!HNTs(gH1s);              // OK
}
```

---

## 7. Statements

### Declaration

```astig
c0hNsTz nH4mH3s:sTRh1Ngz = "Astig";
lH3tsz sH0rH3s:iHNtSZ = 88;
vH4rs gH4dH3s:sTRh1Ngz = "B+";
```

### Assignment

```astig
sH0rH3s = 90;
xH1s += 5;
yH2s -= 1;
yH2s.sH0rH3s = 20;             // record field
aHs[1] = 25;                    // array element
```

### Important rule: function calls

Function calls are **not** standalone statements. Wrap them in `print` or assignment:

```astig
pHR!HNTs(aHDs(1, 2));           // OK
vH4rs xH1s:iHNtSZ = aHDs(1, 2); // OK
aHDs(1, 2);                     // PARSE ERROR
```

### Return, break, continue

```astig
rH3tHUrns xH1s + yH2s;          // return a value
rH3tHUrns;                      // void return

bHREaHKs;                       // exit loop
c0nt1nu3s;                      // skip to next loop iteration
```

---

## 8. Expressions and Operators

### Arithmetic

| Operator | Meaning |
|----------|---------|
| `+` `-` `*` `/` `%` | add, subtract, multiply, divide, modulus |

```astig
vH4rs aH1s:iHNtSZ = xH1s + 10;
vH4rs bH2s:iHNtSZ = xH1s * yH2s;
vH4rs cH3s:iHNtSZ = 20 / 4;
```

### Comparison

| Operator | Meaning |
|----------|---------|
| `==` `!=` `<` `>` `<=` `>=` | equal, not equal, less, greater, etc. |

```astig
pHR!HNTs(aH1s < bH2s);
pHR!HNTs(aH1s == 5);
```

### Logical (jejemon — not ASCII)

| Jejemon | Meaning | Do NOT use |
|---------|---------|------------|
| `nH0ts` | NOT | `!` |
| `aHNdz` | AND | `&&` |
| `0hrS` | OR | `\|\|` |

```astig
!HFs((aH1s > 0) aHNdz (bH2s < 10)) {
  pHR!HNTs("both true");
}

!HFs((aH1s > 10) 0hrS nH0ts (bH2s < 3)) {
  pHR!HNTs("or-not true");
}
```

### Operator precedence (high to low)

1. Unary `-`, `nH0ts`
2. `*`, `/`, `%`
3. `+`, `-`
4. Comparisons (`<`, `>`, `==`, etc.)
5. `aHNdz`
6. `0hrS`

Use parentheses `()` to group expressions when unsure.

### String concatenation

```astig
vH4rs mH3s:sTRh1Ngz = "score: " + sH0rH3s;
```

### Expression levels (simple to advanced)

Work up from basic arithmetic to nested boolean logic:

| Level | Description | Example |
|-------|-------------|---------|
| Simple math | Basic arithmetic | `xH1s + 10`, `xH1s * yH2s`, `20 / 4` |
| Complex math | Nested math + calls + arrays + records | `aHDs(5) + 34 / 2 * aHs[1] + fH1s` |
| Simple boolean | Relational operators | `aH1s < bH2s`, `aH1s == 5` |
| Complex relational | Math on both sides of a comparison | `(aH1s + 1) * 2 > (bH2s - 3)` |
| Logical boolean | AND / OR / NOT | `(aH1s > 0) aHNdz (bH2s < 10)` |
| Nested logical | Boolean and math combined | `(xH1s * 2 + yH2s > 10 aHNdz zH3s <= 15) 0hrS nH0ts (...)` |

Use jejemon logical operators (`aHNdz`, `0hrS`, `nH0ts`) — not ASCII `&&`, `||`, `!`.

---

## 9. Control Flow

### If / else if / else

```astig
!HFs(sH0rH3s >= 90) {
  pHR!HNTs("honor");
} eHLSEs !HFs(sH0rH3s >= 75) {
  pHR!HNTs("pass");
} eHLSEs {
  pHR!HNTs("fail");
}
```

The condition must be **boolean**. `!HFs(xH1s + 1)` is a type error.

### While

```astig
wH1lEs(cH0uHNtHs < 5) {
  cH0uHNtHs += 1;
}
```

### Do-while

```astig
dH0s {
  pHR!HNTs(tH4skH3s);
  tH4skH3s -= 1;
} wH1lEs(tH4skH3s > 0);
```

### For

```astig
fH0rs(vH4rs iH1s:iHNtSZ = 0; iH1s < 4; iH1s = iH1s + 1) {
  pHR!HNTs(iH1s);
}
```

The init clause must use `vH4rs`, `lH3tsz`, or `c0hNsTz` — not a bare identifier.

### Foreach (strings only)

```astig
vH4rs nH4mH3s:sTRh1Ngz = "Hi";
fH0r34cHs(cH4rH3s iHNs nH4mH3s) {
  pHR!HNTs(cH4rH3s);           // prints each character
}
```

Foreach on a number is a type error.

---

## 10. Functions

### Declare and call

```astig
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns pH4ssHs(sH0rH3s:iHNtSZ) {
  pHR!HNTs(sH0rH3s);
  rH3tHUrns;                    // void — no return value
}

fHUncTH!0Ns mHA1Ns() {
  vH4rs rH3s:iHNtSZ = aHDs(3, 4);     // assign return to variable
  pHR!HNTs(aHDs(1, 2));               // use in print
}
```

### Recursion

```astig
fHUncTH!0Ns fH4cHs(nH1s:iHNtSZ):iHNtSZ {
  !HFs(nH1s <= 1) {
    rH3tHUrns 1;
  }
  rH3tHUrns nH1s * fH4cHs(nH1s - 1);
}
```

### Variable scope

Parameters and local variables live inside the function body. Inner blocks can declare their own variables.

```astig
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  vH4rs rH3s:iHNtSZ = xH1s + yH2s;
  {
    lH3tsz jH1s:iHNtSZ = 99;          // inner block only
    pHR!HNTs(jH1s);
  }
  rH3tHUrns rH3s;
}
```

### Nested functions

Functions can be declared inside blocks:

```astig
fHUncTH!0Ns mHA1Ns() {
  !HFs(tRueHz) {
    fHUncTH!0Ns hH3lPrHs():iHNtSZ {
      rH3tHUrns 1;
    }
    pHR!HNTs(hH3lPrHs());
  }
}
```

---

## 11. Records (Structures)

### Declare a record type

```astig
rH3cH0rHDz gH4mH3s {
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz,
  lH1vH3s:bH0oHLeaNs
}
```

### Create and use

```astig
vH4rs yH2s:gH4mH3s = nHEWs gH4mH3s {
  sH0rH3s = 15,
  nH4mH3s = "Hero",
  lH1vH3s = tRueHz
};

pHR!HNTs(yH2s.nH4mH3s);           // read field
yH2s.sH0rH3s = 20;                // write field
```

Field types in the literal must match the record declaration.

---

## 12. Arrays

Primitive **int arrays only**:

```astig
lH3tsz aHs:iHNtSZ[] = [10, 20, 30];
aHs[1] = 25;
pHR!HNTs(aHs[0] + aHs[2]);
```

**Not supported:** arrays of records, arrays of strings, etc.

Out-of-bounds access causes a runtime error.

---

## 13. Pointers and Heap

### Address-of and dereference

```astig
lH3tsz vHAlHs: iHNtSZ = 256;
lH3tsz xHs: iHNtSZ* = &vHAlHs;    // address-of
lH3tsz yHs: iHNtSZ = *xHs;        // dereference
pHR!HNTs(yHs);                    // prints 256
```

Variables with initializers are stored on a **virtual heap**. The `&` operator captures a heap address; `*` reads through it.

### Heap and garbage collection

AstigLang includes a **virtual heap emulator**:

- Variables with initializers are heap-allocated
- The runtime allocates memory as your program runs
- **Mark-and-sweep garbage collection** runs when heap usage reaches 75%
- Freed memory is recycled for new allocations

When you use `&` and `*`, you are working with addresses on this heap — not raw machine pointers.

---

## 14. Input and Output

### Print (output)

```astig
pHR!HNTs("Hello");
pHR!HNTs(xH1s + yH2s);
pHR!HNTs(aHDs(1, 2));
pHR!HNTs(tRueHz);                 // prints true/false
```

`print` is a **statement**, not an expression. You cannot write `vH4rs x = pHR!HNTs(1)`.

### Scan (input from keyboard)

```astig
vH4rs sHC0rH3s:iHNtSZ = 0;
scH4nz("Enter score: ", sHC0rH3s);
pHR!HNTs(sHC0rH3s);
```

Rules:

- Variable must already be declared
- Variable must **not** be `const`
- Input is converted to the variable's type (int, float, string, char, boolean)

Run with piped input when you need to test without typing at the keyboard:

```bash
echo "42" | npm start -- myprogram.stg
```

---

## 15. Includes and Export

### Include a library file

```astig
iHNcHLuHD3s libHs.stg
```

| Rule | Detail |
|------|--------|
| Filename | Letters only + `.stg` (e.g. `libHs.stg`, not `lib-hs.stg`) |
| Library file | Records + functions only, **no main** |
| Entry file | Merges included code, then runs `main` |

### Export (share functions across files)

**Library file** (`libHs.stg`):

```astig
fHUncTH!0Ns dH1bHs(xH1s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s * 2;
}

eHXpH0RTz fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns dH1bHs(xH1s) + yH2s;
}
```

**Entry file**:

```astig
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(10, 5));    // OK — exported
  pHR!HNTs(dH1bHs(4));      // ERROR — not exported
}
```

### Who can call what

| Caller | Can call |
|--------|----------|
| Same file | Any function in that file |
| Entry file `main` | All entry-file functions + exported functions from includes |
| Another include file | Only **exported** functions from other files |

Records from includes are always visible (no `export` on records yet).

---

## 16. Errors, Messaging, and Recovery

This section covers how AstigLang reports errors and keeps going to find more issues.

### What error messages look like

Every error shows:

- **Phase** — Lexical, Syntax, Type, or Runtime
- **Location** — file, line, and column
- **Message** — what went wrong
- **Source line + caret** — points to the exact spot
- **Hint** — how to fix it (when helpful)

Example:

```
Syntax error at myfile.stg:11:8
  Missing '(' at 'xH1s'
  |   !HFs xH1s > 0) {
  |        ^
```

### Error messaging

AstigLang messages are designed to be:

| Quality | What you get |
|---------|--------------|
| **Accurate** | Names the real problem (wrong type, undeclared name, bad token) |
| **Informative** | Shows where, shows the line, suggests a fix |

### Error recovery (by phase)

The compiler reports **many errors in one run** instead of stopping at the first:

| Phase | Who recovers | What happens |
|-------|--------------|--------------|
| **Lexical** | ANTLR lexer | Skips bad tokens, keeps scanning |
| **Parse** | ANTLR parser | Resyncs, collects syntax errors |
| **Type check** | Type checker | Checks remaining statements |
| **Runtime** | Interpreter | Runs remaining statements |

Recovery footers you may see:

- *Lexer skipped invalid input and continued scanning (error recovery).*
- *Parser used ANTLR error recovery and continued after syntax errors.*
- *Type checker continued after errors and reported all issues found (error recovery).*
- *Interpreter continued after errors and reported all issues found (error recovery).*

Lex and parse errors **block execution**. Type and runtime errors are collected and shown together at the end.

### Semantic errors (five common types)

| # | Error | Example |
|---|-------|---------|
| 1 | Undeclared variable | `pHR!HNTs(uH4nHs)` without declaring `uH4nHs` |
| 2 | Type mismatch | `vH4rs xH1s:iHNtSZ = "hello"` |
| 3 | Multiply-defined variable | Declaring `zH3s` twice in same scope |
| 4 | Constant reassignment | Assigning or scanning into `const` |
| 5 | Cardinality / ordinality | Wrong number or types of function arguments |

Some of these are caught at **type-check** time; others appear at **runtime** when the interpreter reaches the bad line.

### Runtime exceptions

Runtime failures use named exception types such as:

`UndefinedVariableError`, `RedeclarationError`, `ConstAssignmentError`, `UninitializedVariableError`, `UndefinedFunctionError`, `ArrayBoundsError`, `ArrayTypeError`, `InvalidOperationError`, `PrintError`, `ScanError`

### Writing robust code

Write defensively: check array bounds, declare variables before use, match function argument types, and keep `const` values read-only. Nested loops, boundary values, and storing function return values in variables are all normal patterns — the language handles them as long as your types and scopes are correct.

---

## 17. Compiler Pipeline

When you run `npm start -- program.stg`, your source goes through six steps:

```
Source  →  Lex + Parse  →  AST  →  Type Check  →  Optimize  →  Interpret  →  Output
```

### Step-by-step flow

```
read .stg file
  → parse (syntax check)           stops here if syntax is bad
  → build AST                      your program as a tree
  → merge includes (if any)        pull in library files
  → type check                     find semantic errors
  → optimize                       remove dead code, fold constants
  → interpret                      run main, collect print output
  → show output
```

Type checking uses the **original** program tree. The interpreter runs the **optimized** version.

### Phase 1: Lex + Parse

**Goal:** Turn text into tokens, then into a parse tree.

```
source  →  Lexer  →  tokens  →  Parser  →  parse tree
```

- Bad tokens (plain English like `var`, `print`) → lexical error
- Bad syntax (missing `(`, wrong file layout) → syntax error
- If syntax fails, the program **does not run**

### Phase 2: AST (Abstract Syntax Tree)

The parse tree is converted into AstigLang's own AST — a structured representation of your program (statements, expressions, functions, records).

Each node stores a **line and column** for error messages.

### Phase 3: Module loading (includes)

If your file has `iHNcHLuHD3s libHs.stg`, the loader:

- Reads the library file
- Merges records and functions
- Checks for circular includes and missing files
- Applies `export` rules (only exported functions are visible across files)

### Phase 4: Type check

**Goal:** Catch errors before running.

Checks include:

- Type mismatches
- Undeclared names (some caught at runtime)
- Redeclarations
- `const` rules
- Function argument count and types
- Record field types
- Array and scan targets

With **error recovery**, the checker continues after each error and reports all issues at the end.

### Phase 5: Optimize

**Goal:** Make the program faster without changing behavior.

The optimizer runs automatically on every program:

| Optimization | Example |
|--------------|---------|
| Dead code elimination | Remove unused variables |
| Dead branch elimination | Remove `if (false) { ... }` |
| Constant folding | `2 + 3` becomes `5` |
| Copy propagation | Reuse known values |
| Algebraic simplification | `x + 0` becomes `x` |
| Strength reduction | `xH1s * 8` becomes `xH1s << 3` |

The optimizer runs silently — you do not call it in your source code.

### Phase 6: Interpret

**Goal:** Run `main` and collect all `print` output.

The interpreter:

- Creates runtime scopes for variables
- Uses a **virtual heap** for variables with initializers
- Runs garbage collection when heap usage reaches 75%
- Wraps `print` and `scan` in error handling
- Collects multiple runtime errors in recovery mode

Only the entry file's `main` runs. Included library files do not execute on their own.

### Pipeline demo command

Generate text dumps of every phase:

```bash
npm run pipeline
```

Output files in `text-files/`:

| File | Contents |
|------|----------|
| `pipeline-output.txt` | All phases combined |
| `scanner-output.txt` | Tokens |
| `parse.txt` | Parse trees |
| `ast.txt` | AST dumps |
| `optimizedAST.txt` | Optimized AST dumps |
| `interpreter-output.txt` | Run output |
| `scanner-error-dump.txt` | Lexical errors |

### Data at each stage

| Stage | What exists |
|-------|-------------|
| Source | Your `.stg` text |
| Tokens | Keywords, identifiers, numbers, strings |
| Parse tree | ANTLR tree structure |
| AST | `ProgramNode`, statements, expressions |
| Optimized AST | Same shapes, fewer dead nodes |
| Types | Variable and expression types |
| Runtime | Values in memory + heap |

---

## 18. Do and Don't Quick Guide

### File layout

| Do | Don't |
|----|-------|
| Put `main` last | Put `main` before other functions |
| Code inside functions | Print at top level |
| Use jejemon names | Use `var`, `print`, `count` |

### Variables

| Do | Don't |
|----|-------|
| `vH4rs xH1s:iHNtSZ = 10` | `vH4rs xH1s = 10` (no type) |
| Use variables inside their block | Use block variables outside |
| Reassign `var` / `let` | Reassign or scan into `const` |

### Functions

| Do | Don't |
|----|-------|
| `pHR!HNTs(aHDs(1, 2))` | `aHDs(1, 2)` alone |
| `vH4rs x = aHDs(1, 2)` | Return wrong type from function |
| `eHXpH0RTz` for shared lib functions | Call private lib function from another file |

### Operators

| Do | Don't |
|----|-------|
| `aHNdz`, `0hrS`, `nH0ts` | `&&`, `\|\|`, `!` |
| `scH4nz` for input | `read(...)` |
| `pHR!HNTs(...)` for output | Use print as expression |

---

## 19. Learning Path

Use this order when you are new to AstigLang. Each step builds on the last.

| Step | Topic | Read |
|------|-------|------|
| 1 | Install, run your first program | §2 Getting Started |
| 2 | File layout: includes, records, functions, `main` | §3 How a Program Is Structured |
| 3 | Jejemon names and keywords | §4, §5 |
| 4 | Types, `const` / `var` / `let`, scope | §6 |
| 5 | Declarations, assignment, return | §7 |
| 6 | Simple math, then comparisons and logic | §8 |
| 7 | `if`, `while`, `for`, `do-while`, `foreach` | §9 |
| 8 | Declare, call, recurse, nest functions | §10 |
| 9 | Records and int arrays | §11, §12 |
| 10 | `print`, `scan`, pointers, heap | §13, §14 |
| 11 | Split code across files with include/export | §15 |
| 12 | Read errors; understand the pipeline | §16, §17 |
| 13 | Quick do/don't before you submit | §18 |

### First complete program to try

After steps 1–7, you should be able to write a small grading program:

```astig
fHUncTH!0Ns mHA1Ns() {
  vH4rs sH0rH3s:iHNtSZ = 0;
  scH4nz("Enter score: ", sH0rH3s);

  !HFs(sH0rH3s >= 90) {
    pHR!HNTs("honor");
  } eHLSEs !HFs(sH0rH3s >= 75) {
    pHR!HNTs("pass");
  } eHLSEs {
    pHR!HNTs("fail");
  }
}
```

Save it as `grades.stg`, then run:

```bash
npm start -- grades.stg
```

### What to practice at each stage

**Expressions** — Start with `+`, `-`, `*`, `/`. Add function calls and array indexing. Then comparisons. Last, combine with `aHNdz`, `0hrS`, and `nH0ts`.

**Control flow** — One loop type at a time. Nest an `if` inside a `for` before mixing every loop form in one file.

**Functions** — Write a function that returns a value, print the result, then call it from another function, then try recursion.

**Types and memory** — Use records for grouped data, arrays for lists of ints, pointers when you need an address on the heap.

**Modules** — Move shared helpers into a library file, mark only what others need with `eHXpH0RTz`, include from your entry file.

When something fails, read the error phase (Lexical, Syntax, Type, Runtime), fix the line the caret points to, and run again.

---

*End of AstigLang User Manual*

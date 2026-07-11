# AstigLang — Language Manual

AstigLang is a jejemon-styled programming language. Source files use the `.stg` extension.

**Run a program**

```bash
npm start -- path/to/program.stg
```

**Pipeline:** Lexer → Parser → AST → include merge → type check → interpreter

---

## 1. Program structure

A file is **not** a loose script. Top level may only contain, in order:

| Section | Required? |
|---------|-----------|
| `include` directives | No |
| `record` declarations | No |
| `function` declarations | No |
| `function main()` | **Yes** (entry file only) |

There are **no top-level executable statements**. All code runs inside `main` or functions called from it.

```astig
iHNcHLuHD3s lib.stg

rH3cH0rHDz gH4mH3s {
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz
}

fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(1, 2));
}
```

---

## 2. `main` — entry point rules

| File type | `main` rule |
|-----------|-------------|
| **Entry file** (what you pass to `npm start`) | **Must** define `function main()` |
| **Include/library file** | **Must not** define `main` |

`main` syntax:

```astig
fHUncTH!0Ns mHA1Ns() {
  // entry-point code here
}
```

- No parameters
- No return type
- Only `main` runs at startup; other functions run when called

**Errors if `main` is missing (entry file):**

```
Entry program file must define function main()
```

**Error if an include file defines `main`:**

```
Include file "lib.stg" must not define main; only the entry program file may define main
```

---

## 3. Jejemon naming

Keywords and identifiers use **jejemon spellings**, not plain English.

- Letters may be substituted: `0`→O, `1`→I, `3`→E, `4`→A, `8`→B, etc.
- `H` / `h` is often inserted inside words
- Identifiers usually end in `s`/`z` (or `S`/`Z`)
- Plain names like `count` or `add` **will not lex**

**Valid identifier examples:** `nH4mH3s`, `sH0rH3s`, `xH1s`, `aHDs`, `cH0uHNtHs`

---

## 4. Keywords reference

| Meaning | Example spelling | Minimal example |
|---------|------------------|-----------------|
| include | `iHNcHLuHD3s` | `iHNcHLuHD3s lib.stg` |
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
| for | `fH0rs` | `fH0rs(vH4rs iH1s:iHNtSZ = 0; iH1s < 5; iH1s = iH1s + 1) { ... }` |
| foreach | `fH0r34cHs` | `fH0r34cHs(cH4rH3s iHNs nH4mH3s) { ... }` |
| in (foreach) | `iHNs` | see foreach example |
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

## 5. Types

| Type | Example spelling |
|------|------------------|
| int | `iHNtSZ` |
| float | `fHLoaTHsz` |
| string | `sTRh1Ngz` |
| char | `cH4rHz` |
| boolean | `bH0oHLeaNs` |
| void (return only) | `vH0iDs` |
| record (user-defined) | record name, e.g. `gH4mH3s` |
| int array | `iHNtSZ[]` (primitive arrays only) |

Type annotation is **required** on variable declarations:

```astig
vH4rs nH4mH3s:sTRh1Ngz = "Astig";
vH4rs cH0uHNtHs:iHNtSZ = 10;
vH4rs fH4cH3s:fHLoaTHsz = 3.14;
```

All three declaration keywords (`const`, `var`, `let`) are **block-scoped**.

---

## 6. Statements

### Declarations

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
yH2s.sH0rH3s = 20;          // record field
```

### Print

```astig
pHR!HNTs("hello");
pHR!HNTs(xH1s + yH2s);
pHR!HNTs(aHDs(1, 2));
```

### Scan (stdin)

```astig
scH4nz("Enter name: ", nH4mH3s);
scH4nz(sHC0rH3s);              // optional prompt omitted
```

- Prompt is an optional string literal followed by a variable name
- Variable must be declared and **not** `const`
- Input is coerced to the variable’s declared type (`int`, `float`, `string`, `char`, `boolean`)

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

### Foreach (over a string)

```astig
fH0r34cHs(cH4rH3s iHNs nH4mH3s) {
  pHR!HNTs(cH4rH3s);
}
```

### Return

```astig
rH3tHUrns xH1s + yH2s;
rH3tHUrns;                  // void return
```

### Break

```astig
bHREaHKs;
```

**Note:** Function calls are **not** standalone statements. Use them inside expressions:

```astig
pHR!HNTs(aHDs(1, 2));       // OK
vH4rs xH1s:iHNtSZ = aHDs(1, 2);  // OK
aHDs(1, 2);                 // NOT allowed
```

---

## 7. Expressions

| Feature | Operators / forms |
|---------|-------------------|
| Arithmetic | `+` `-` `*` `/` `%` |
| Comparison | `==` `!=` `<` `>` `<=` `>=` |
| Logical (jejemon) | `nH0ts` (NOT), `aHNdz` (AND), `0hrS` (OR) — **not** ASCII `!` `&&` `\|\|` |
| Unary minus | `-xH1s` |
| Grouping | `(xH1s + yH2s) * zH3s` |
| String concat | `"a" + "b"`, `"score: " + xH1s` |
| Function call | `aHDs(1, 2)` |
| Member access | `yH2s.sH0rH3s` |
| Array literal / index | `[10, 20, 30]`, `aHs[0]`, `aHs[1] = 25` |
| Literals | `42`, `3.14`, `"text"`, `tRueHz`, `fHAls3z` |

**Operator precedence (high → low):** unary `-` / `nH0ts`, `*` `/` `%`, `+` `-`, comparisons, `aHNdz`, `0hrS`.

**Comments:** `//` line comments and `/* */` block comments are ignored by the lexer.

**Arrays (primitive `int` only):**

```astig
lH3tsz aHs:iHNtSZ[] = [10, 20, 30];
aHs[1] = 25;
pHR!HNTs(aHs[0] + aHs[2]);
```

Array-of-record types and non-`int` element types are not supported yet.

---

## 8. Functions

```astig
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns pH4ssHs(sH0rH3s:iHNtSZ) {
  pHR!HNTs(sH0rH3s);
  rH3tHUrns;
}
```

- Parameters may have type annotations
- Return type is optional; omit for void functions
- Functions can be nested inside blocks

**Optional `export` keyword** (library files — see §10):

```astig
eHXpH0RTz fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}
```

Mark functions with `eHXpH0RTz` to make them callable from other files via `include`. Private helpers in the same file do not need `export`. Entry-file functions do not need `export` for `main` to call them.

---

## 9. Records

**Declare a record type:**

```astig
rH3cH0rHDz gH4mH3s {
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz,
  lH1vH3s:bH0oHLeaNs
}
```

**Create and use:**

```astig
vH4rs yH2s:gH4mH3s = nHEWs gH4mH3s {
  sH0rH3s = 15,
  nH4mH3s = "Hero",
  lH1vH3s = tRueHz
};

pHR!HNTs(yH2s.nH4mH3s);
yH2s.sH0rH3s = 20;
```

---

## 10. Includes and export

Pull in library files (records + functions only):

```astig
iHNcHLuHD3s libHs.stg
```

| Rule | Detail |
|------|--------|
| Filename format | letters only + `.stg` (e.g. `libHs.stg`) |
| Library files | no `main`, no execution |
| Entry file | merges included records/functions, then runs `main` |
| Circular includes | rejected with error |
| Cross-file functions | Only **`export`** functions from a library file are visible outside that file |
| Same-file helpers | Non-exported functions remain callable inside their own file |
| Entry-file functions | All top-level functions in the entry file are visible to `main` (no `export` needed) |
| Records | All record types from an include are merged (no `export` on records yet) |

### Export visibility (how it works)

Think of each `.stg` file as a small module:

| Caller location | Can call |
|-----------------|----------|
| Same library file | Any function in that file (exported or not) |
| Entry file (`main`) | Exported functions from includes + all entry-file functions |
| Another included file | Only **exported** functions from other files |

**Pipeline:**

1. **`programLoader`** — merges exported library functions into the global function list; keeps every file’s functions in `moduleFunctions` for same-file lookup.
2. **`typeChecker`** — registers global functions, then type-checks each file using that file’s module scope.
3. **`interpreter`** — same scope rules at runtime when `main` or a function runs.

**Working demo:**

| File | Role |
|------|------|
| `demo-examples/libHs.stg` | private `dH1bHs`, exported `aHDs` |
| `demo-examples/include-main.stg` | includes the library and calls `aHDs` from `main` |

```bash
npm start -- demo-examples/include-main.stg
```

Calling a non-exported function from another file fails at type check:

```text
Type error: Function "dH1bHs" is not exported from "libHs.stg"
```

### Sharing functions across files

**Library file** (`libHs.stg`) — no `main`:

```astig
fHUncTH!0Ns dH1bHs(xH1s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s * 2;
}

eHXpH0RTz fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns dH1bHs(xH1s) + yH2s;
}
```

**Entry file** (`include-main.stg`):

```astig
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(10, 5));   // OK — exported
  pHR!HNTs(dH1bHs(4));     // type error — not exported
}
```

Run:

```bash
npm start -- demo-examples/include-main.stg
```

### Sharing record types across files

Record declarations in an include file are merged the same way — no `export` keyword on records:

```astig
// libHs.stg
rH3cH0rHDz pH0iHNtHs {
  xH1s:iHNtSZ,
  yH2s:iHNtSZ
}

eHXpH0RTz fHUncTH!0Ns mH4kH3Hs(xH1s:iHNtSZ, yH2s:iHNtSZ):pH0iHNtHs {
  vH4rs rH3s:pH0iHNtHs = nHEWs pH0iHNtHs { xH1s = xH1s, yH2s = yH2s };
  rH3tHUrns rH3s;
}
```

```astig
// main.stg
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  vH4rs pH1s:pH0iHNtHs = mH4kH3Hs(3, 4);
  pHR!HNTs(pH1s.xH1s);
  pHR!HNTs(pH1s.yH2s);
}
```

### What you cannot share via includes

| Item | Why |
|------|-----|
| Top-level variables | Not allowed in `.stg` file layout — use functions or pass values through `main` |
| `main` | Only the entry file may define it |
| `export` on variables | Not in the grammar |

---

## 11. Errors you may see

Diagnostics are formatted with **filename, line, column, source line, and caret** for lex, parse, type, and runtime phases (`utils/diagnostics.ts`).

### Semantic errors (type checker)

The type checker reports these static violations (see `Criteria.md` §8):

| # | Situation | Example message |
|---|-----------|-----------------|
| 1 | Undeclared variable | `Undeclared variable "uH4nHs"` |
| 2 | Type mismatch | `Type error: Cannot assign value of type string to variable of type int` |
| 3 | Multiply-defined variable | `Variable "zH3s" is already declared in this scope` |
| 4 | Constant reassignment | `Cannot assign to const variable "xH1s"` / `Cannot scan into const variable "xH1s"` |
| 5 | Cardinality / ordinality | Wrong argument count or types at parameter positions |

**Type-check recovery:** `typeCheckProgram()` continues after recoverable errors and reports **all** issues in one run, with a footer note. Demo: `npm start -- test-case/semantic-errors.stg` (7 errors).

### Other errors

| When | Message |
|------|---------|
| Entry file has no `main` | `Entry program file must define function main()` |
| Include file has `main` | `Include file "..." must not define main; ...` |
| Missing include file | `Include file not found: "..."` |
| Circular include | `Circular include detected for "..."` |
| Syntax / lexical error | Humanized ANTLR message + hint (e.g. plain English token, ASCII `&&`) |
| Call non-exported function from another file | `Function "..." is not exported from "..."` |
| Runtime failure | `Runtime error: ...` with statement location when available |

Lex/parse errors collect all diagnostics before exit. The interpreter does **not** recover — first runtime error stops execution.

---

## 12. Required `.stg` file structure

The parser and loader enforce a fixed layout. A file that does not match this shape will not run, even if individual statements are valid.

**Grammar rule (top level):**

```text
include* → record* → function* → main? → EOF
```

There are **no top-level executable statements**. All runtime code lives inside `main` or inside functions called from it.

### Entry program file

This is the file you pass to `npm start`. It **must** define `function main()` as the **last** top-level item.

```astig
iHNcHLuHD3s libHs.stg          // 1. includes (optional, first)

rH3cH0rHDz gH4mH3s {           // 2. record types (optional)
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz
}

fHUncTH!0Ns aHDs(              // 3. helper functions (optional)
  xH1s:iHNtSZ,
  yH2s:iHNtSZ
):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns mHA1Ns() {         // 4. main (required, must be last)
  vH4rs xH1s:iHNtSZ = aHDs(1, 2);
  pHR!HNTs(xH1s);
}
```

| Rule | Detail |
|------|--------|
| `main` | Required; must be `fHUncTH!0Ns mHA1Ns() { ... }` with no parameters and no return type |
| `main` position | Must come **after** all other top-level functions |
| Top-level statements | Not allowed (`pHR!HNTs(...)` or `vH4rs ...` at file scope will not parse) |
| Includes | Optional; resolved relative to the entry file's directory |
| Type annotations | Required on variable declarations (`vH4rs xH1s:iHNtSZ = ...`) |

**Minimal runnable entry file:**

```astig
fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("hello");
}
```

### Include / library file

Pulled in with `iHNcHLuHD3s filename.stg`. Same top-level layout as an entry file, but **must not** define `main`.

```astig
rH3cH0rHDz pH0iHNtHs {
  xH1s:iHNtSZ,
  yH2s:iHNtSZ
}

fHUncTH!0Ns dH1sH3Hs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s - yH2s;
}
```

| Rule | Detail |
|------|--------|
| `main` | Must **not** appear |
| Filename in `include` | Letters only + `.stg` (e.g. `libHs.stg`, not `lib-hs.stg`) |
| Semicolon after include | Optional (`iHNcHLuHD3s libHs.stg` or `...;`) |
| Contents merged into entry | Records and functions from all includes are merged before type check and run |

### Multi-file layout example

```text
project/
  main.stg       ← entry file (has main)
  libHs.stg      ← library (records + functions only)
```

```astig
// main.stg
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(10, 3));
}
```

```astig
// libHs.stg
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}
```

Run:

```bash
npm start -- main.stg
```

### What goes inside function bodies

Inside `main` and other functions, use normal statements: declarations, assignment, `print`, control flow, `return`, `break`, and nested blocks/functions.

Function calls are **not** standalone statements — wrap them in `print` or an assignment:

```astig
pHR!HNTs(aHDs(1, 2));              // OK
vH4rs xH1s:iHNtSZ = aHDs(1, 2);    // OK
aHDs(1, 2);                        // parse error
```

### Invalid layouts (will not run)

| Problem | Result |
|---------|--------|
| Entry file missing `main` | `Entry program file must define function main()` |
| Include file defines `main` | `Include file "..." must not define main; ...` |
| `main` before other functions | Syntax error (parser expects `function*` then `main`) |
| Record or include after a function | Syntax error (wrong section order) |
| Top-level `pHR!HNTs(...)` | Syntax error |
| Missing include file | `Include file not found: "..."` |
| Circular includes | `Circular include detected for "..."` |

### Working sample programs

**`test-case/`** — one `.stg` per rubric construct (`Criteria.md` rows 7–28): variables, arrays, records, loops, booleans, functions, recursion, I/O, etc.

**`demo-examples/`** — consolidated tours and error demos:

| File | Covers |
|------|--------|
| `language-showcase.stg` | full syntax tour (include, records, loops, arrays, logical ops, scan/print) |
| `semantic-errors.stg` (in `test-case/`) | all five semantic error categories in one run |
| `human-readable-errors.stg`, `type-errors-multi.stg` | friendly type diagnostics + recovery |
| `syntax-error.stg`, `lexical-error.stg` | deliberate parse/lex error demos |
| `scan-test.stg`, `array-test.stg`, `logical-op-test.stg` | focused runtime demos |
| `libHs.stg` + `include-main.stg` | includes, `export`, private vs public functions |

```bash
npm start -- test-case/semantic-errors.stg
npm start -- demo-examples/language-showcase.stg
npm start -- demo-examples/include-main.stg
npm run pipeline    # pipeline demo (lexer, parse, AST, interpreter output files)
```

---

## 13. Not yet supported

Features still open in the project task list (`README.md`) that are **not available** in the current implementation:

| Feature | Status |
|---------|--------|
| Pointers | Not implemented (`test-case/pointers.stg` is a placeholder) |
| Heap simulation | Not implemented |
| `repeat-until` loops | Not implemented (use `do`/`while` instead) |
| User-defined type aliases | Not implemented |
| `export` on record types | Not implemented (all records in an include are visible) |
| Arrays of records / non-int element types | Not implemented (primitive `iHNtSZ[]` only) |
| ASCII logical operators (`&&`, `\|\|`, `!`) | Rejected at lex/parse — use `aHNdz`, `0hrS`, `nH0ts` |

### Current behavioral limits

These constraints apply even when using only supported syntax:

- No top-level statements outside `main` / functions (see §12)
- No standalone function-call statements — wrap calls in `print`, `scan`, or assignment
- `print` and `scan` are statements, not expressions
- `foreach` iterates over **strings** only (character by character)
- `const` variables cannot be reassigned or used as `scan` targets (caught at type check)
- All keywords and identifiers must use valid jejemon spellings
- Type errors use the enclosing statement’s source location (not sub-expression spans)

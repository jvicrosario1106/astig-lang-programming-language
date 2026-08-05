# AstigLang Pipeline

`.stg` source goes through six steps:

```
Source  →  Lex + Parse  →  AST  →  Type check  →  Optimize  →  Interpret  →  Output
```

**Full run:** `npm start -- program.stg` (driver: `src/main.ts` → `src/runAstigProgram.ts`)

---

## Commands

| Command | What it does |
|---------|--------------|
| `npm start -- file.stg` | Full pipeline (run a program) |
| `npm run pipeline` | **Presentation demo** — all phases → `text-files/` + console |
| `npm run generate` | Regenerate ANTLR from `grammar/AstigLang.g4` |

**Pipeline demo output** (from `src/pipelineDemo.ts`, written to `text-files/`):

| File | Contents |
|------|----------|
| `text-files/pipeline-output.txt` | All phases combined (best for presentation) |
| `text-files/scanner-output.txt` | Tokens per sample file |
| `text-files/parse.txt` | Parse trees |
| `text-files/ast.txt` | `ProgramNode` ASCII dumps |
| `text-files/optimizedAST.txt` | Optimized AST dumps |
| `text-files/interpreter-output.txt` | Type check + print output |
| `text-files/scanner-error-dump.txt` | Lexical errors only |

Sample programs: `src/pipelineDemoFiles.ts` (`demo-examples/heap-test*.stg`, `optimizer-dce-test.stg`, `test-case/24-arrays.stg`)

---

## `npm start` flow

```
read .stg
  → parse (syntax gate)              runAstigProgram.ts
  → loadProgram / buildAst           programLoader.ts + ast.ts
  → typeCheckProgram                 typeChecker.ts (+ recovery)
  → optimizeProgram                  optimizer.ts
  → runProgram                       interpreter.ts (+ recovery)
  → print output
```

**Parse runs twice on success:** once as an early gate in `runAstigProgram.ts`, again inside `loadProgram()` when building the AST.

```mermaid
sequenceDiagram
  participant Main as runAstigProgram.ts
  participant Parse as parseWithDiagnostics
  participant Loader as programLoader
  participant TC as typeChecker
  participant Opt as optimizer
  participant Int as interpreter

  Main->>Parse: parseProgramSource (gate)
  alt syntax errors
    Main-->>Main: reportDiagnostics → exit 1
  end
  Main->>Loader: loadProgram → buildAst
  Main->>TC: typeCheckProgram (recovery on)
  alt type errors collected
    Main-->>Main: continue with typeDiagnostics
  end
  Main->>Opt: optimizeProgram(ast)
  Main->>Int: runProgram(optimizedAst)
  alt runtime errors collected
    Main-->>Main: RuntimeErrors → reportDiagnostics → exit 1
  end
  Main-->>Main: print Output
```

---

## Phases

### 1. Lex + Parse

**Goal:** Text → ANTLR parse tree. Bad syntax stops here.

| File | Role |
|------|------|
| `grammar/AstigLang.g4` | Grammar source of truth |
| `generated/grammar/` | ANTLR lexer + parser |
| `src/utils/parseWithDiagnostics.ts` | `parseSourceWithDiagnostics()` |
| `src/utils/diagnostics.ts` | `humanizeAntlrMessage()` |

```
source  →  AstigLangLexer  →  tokens  →  AstigLangParser  →  program()
```

**Recovery:** ANTLR-side — lexer skips bad tokens; parser resyncs. Custom listeners collect all diagnostics. Demo: `test-case/28-lexical-error-recovery.stg`, `test-case/29-parse-error-recovery.stg`.

---

### 2. AST

**Goal:** Parse tree → `ProgramNode` (your own AST).

| File | Role |
|------|------|
| `src/ast.ts` | `buildAst()` |
| `src/models/` | AST node types |

Each statement gets a `location` (line/column) for error carets.

---

### 3. Module loading (optional)

**Goal:** Resolve `iHNcHLuHD3s` includes and merge records/functions.

| File | Role |
|------|------|
| `src/programLoader.ts` | `loadProgram()`, `mergeIncludedModules()` |
| `src/utils/moduleScope.ts` | Export vs private functions |

Rules:
- Only the **entry file** may define `mHA1Ns()`.
- `eHXpH0RTz` marks functions callable from other files.
- Missing or circular includes → error during load.

Single file with no includes uses `finalizeStandaloneProgram()`.

---

### 4. Type check

**Goal:** Catch semantic errors before running.

| File | Role |
|------|------|
| `src/typeChecker.ts` | `typeCheckProgram()` |
| `src/utils/typeCheckRecovery.ts` | Report multiple errors in one run |
| `src/classes/TypeEnvironment.ts` | Symbol table (name → type) |
| `src/classes/RecordRegistry.ts` | Record field types |

Checks: type mismatches, redeclarations, `const` rules, function args, records, arrays, `scan` targets.

On failure → `TypeCheckErrors` → all diagnostics printed + recovery note. Execution may still proceed to collect runtime errors.

**Demo:** `npm start -- test-case/26-semantic-errors.stg` (7 errors)

---

### 5. Optimize

**Goal:** Transform AST for efficiency before interpretation.

| File | Role |
|------|------|
| `src/optimizer.ts` | `optimizeProgram()` |

Passes: dead code elimination, dead branch elimination, constant folding, copy propagation, algebraic simplification, strength reduction.

Type checking uses the **original** AST; the interpreter runs the **optimized** AST.

**Demo:** `demo-examples/optimizer-dce-test.stg`, `text-files/optimizedAST.txt`

---

### 6. Interpret

**Goal:** Run `mHA1Ns()` and collect `pHR!HNTs` output.

| File | Role |
|------|------|
| `src/interpreter.ts` | `runProgram()` |
| `src/classes/RuntimeEnvironment.ts` | Symbol table (name → value) |
| `src/classes/HeapEmulator.ts` | Virtual heap, malloc/free, GC |
| `src/classes/RuntimeExceptions.ts` | Java-style runtime exception classes |
| `src/utils/runtimeRecovery.ts` | Report multiple runtime errors in one run |
| `src/utils/scanUtils.ts` | `scH4nz` stdin |

Only the entry file's `main` body runs. Included files do not auto-execute.

**Demo:** `npm start -- test-case/27-runtime-error.stg` (14 runtime errors)

---

## Errors

All errors print **file:line:column**, source line, caret, and optional hint (when source is available).

| Phase | When | Handled in |
|-------|------|------------|
| `lex` / `parse` | Bad token or syntax | `runAstigProgram.ts` → `reportDiagnostics` |
| `type` | Semantic violation | `TypeCheckErrors` → `reportDiagnostics` |
| `include` | Bad include graph | `reportExecutionError` |
| `runtime` | Execution failure | `RuntimeErrors` or `RuntimeError` |

**Key files:**

| File | Role |
|------|------|
| `src/utils/diagnostics.ts` | Format messages, carets, recovery footers |
| `src/utils/parseWithDiagnostics.ts` | Collect lex/parse diagnostics |
| `src/utils/typeCheckRecovery.ts` | Continue type check after recoverable errors |
| `src/utils/runtimeRecovery.ts` | Continue interpretation after recoverable errors |
| `src/runAstigProgram.ts` | Pipeline orchestration, error routing |

### Error recovery

| Phase | Behavior | Demo |
|-------|----------|------|
| Lexer | Skips bad input, keeps scanning (ANTLR) | `test-case/28-lexical-error-recovery.stg` |
| Parser | Collects syntax errors before exit (ANTLR) | `test-case/29-parse-error-recovery.stg` |
| Type checker | Records each statement error, reports all at end | `test-case/26-semantic-errors.stg`, `30-error-messaging.stg` |
| Interpreter | Records each statement error, reports all at end | `test-case/27-runtime-error.stg` |

Recovery footers:

> Note: Lexer skipped invalid input and continued scanning (error recovery).  
> Note: Parser used ANTLR error recovery and continued after syntax errors.  
> Note: Type checker continued after errors and reported all issues found (error recovery).  
> Note: Interpreter continued after errors and reported all issues found (error recovery).

---

## Data at each stage

| Stage | What you have |
|-------|---------------|
| Source | Plain text |
| Tokens | `VAR_KW`, `IDENTIFIER`, `NUMBER`, … |
| Parse tree | ANTLR `(program …)` tree |
| AST | `ProgramNode`, `StatementNode`, `ExpressionNode` |
| Optimized AST | Same shapes, fewer dead nodes / folded constants |
| Types | `ResolvedType` in `TypeEnvironment` |
| Runtime | `RuntimeValue` in `RuntimeEnvironment` + heap |

---

## File map

```
grammar/AstigLang.g4
generated/grammar/

src/main.ts                          CLI entry
src/runAstigProgram.ts               Pipeline orchestration
src/programLoader.ts                 Parse + includes
src/ast.ts                           Parse tree → AST
src/typeChecker.ts                   Static semantics
src/optimizer.ts                     AST optimizations
src/interpreter.ts                   Execution

src/utils/parseWithDiagnostics.ts    Lex + parse + diagnostics
src/utils/diagnostics.ts             Error formatting
src/utils/typeCheckRecovery.ts       Type-check recovery
src/utils/runtimeRecovery.ts         Runtime recovery
src/utils/moduleScope.ts             Export visibility
src/utils/astigTypeUtils.ts          Type helpers
src/utils/scanUtils.ts               scan I/O

src/pipelineDemo.ts                  Unified pipeline demo
src/pipelineDemoFiles.ts             Sample programs for demos

src/models/                          AST shapes
src/classes/                         Environments, heap, errors

test-case/                           Numbered rubric demos (1–31)
demo-examples/                       Tours (includes, heap, optimizer)
text-files/                          Generated pipeline demo output (.txt)
```

---

## Related docs

- `USER-MANUAL.md` — beginner-friendly guide (PDF-ready)
- `LANGUAGE.md` — syntax and language rules
- `SYNTAX-RULES.md` — do / don't quick reference
- `CRITERIA.md` — grading rubric
- `README.md` — task list

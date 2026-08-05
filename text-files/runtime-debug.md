# AstigLang — Symbol Table & Call Stack

## Run summary

| Field | Value |
| --- | --- |
| Source | `test-case/10-loop-event-controlled.stg` |
| Generated | 2026-08-05T09:45:29.023Z |
| Execution mode | Run all (full trace during execution) |
| Status | Completed successfully |

## Program output

| # | Value |
| --- | --- |
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |

## Execution trace

Each step records the **call stack** and **symbol table** as they existed while the program was running.

### Step 1 — Functions registered in global scope @ line 1, col 1

#### Call stack

_Empty — no active function frames._

#### Symbol table

_No bindings in active scopes._

### Step 2 — Enter mHA1Ns @ line 5, col 3

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

_No bindings in active scopes._

### Step 3 — Declare var `cH0uHNtHs` @ line 5, col 3

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 0 |

### Step 4 — Print @ line 7, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 0 |

### Step 5 — Assign `cH0uHNtHs` = @ line 8, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 1 |

### Step 6 — Print @ line 7, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 1 |

### Step 7 — Assign `cH0uHNtHs` = @ line 8, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 2 |

### Step 8 — Print @ line 7, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 2 |

### Step 9 — Assign `cH0uHNtHs` = @ line 8, col 5

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 3 |

### Step 10 — While loop body @ line 6, col 3

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

| Scope | Kind | Name | Type | Value |
| --- | --- | --- | --- | --- |
| block | var | `cH0uHNtHs` | int | @1000 → 3 |

### Step 11 — mHA1Ns finished @ line 5, col 3

#### Call stack

| Frame | Function | Called at |
| ---: | --- | --- |
| 1 | `mHA1Ns` | line 5, col 3 |

#### Symbol table

_No bindings in active scopes._


## Notes

- **Symbol table** — chained `RuntimeEnvironment` scopes from innermost to global.
- **Call stack** — active function frames; frame 1 is the outermost caller.
- **Heap variables** — values shown as `@address → resolved value`.
- Re-run any `.stg` file to replace this report with that program's trace.
# AstigLang — Allowed & Not Allowed Syntax

Quick reference with **Do / Don't** examples, aligned with the **current implementation**.  
See `LANGUAGE.md` for the full manual and `README.md` for the task list.

**Run:** `npm start -- path/to/program.stg`

---

## 1. File & entry point

| Allowed | Not allowed |
|---------|-------------|
| Entry file with `main` | Entry file without `main` |
| Library files: records + functions only | `main` in an include file |
| Order: `include*` → `record*` → `function*` → `main` | Top-level statements |
| `main` last among top-level items | `main` before other functions |

**Do — valid entry file layout:**
```astig
iHNcHLuHD3s libHs.stg

rH3cH0rHDz pH0iHNtHs {
  xH1s:iHNtSZ,
  yH2s:iHNtSZ
}

fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(1, 2));
}
```

**Don't — top-level print (parse error):**
```astig
pHR!HNTs("hello");

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("hello");
}
```

**Don't — `main` before other functions (parse error):**
```astig
fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("hello");
}

fHUncTH!0Ns aHDs(xH1s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s;
}
```

**Don't — `main` in a library file:**
```astig
fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("lib");
}
```

---

## 2. Naming (jejemon)

| Allowed | Not allowed |
|---------|-------------|
| Jejemon keywords and identifiers | Plain English names |
| Markers: `H`, `0`, `1`, `3`, `4`, … | Names like `count`, `add` |

**Do:**
```astig
vH4rs cH0uHNtHs:iHNtSZ = 10;
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}
```

**Don't (will not lex):**
```astig
var count = 10;
function add(x, y) {
  return x + y;
}
```

---

## 3. Declarations & types

| Allowed | Not allowed |
|---------|-------------|
| `c0hNsTz` / `lH3tsz` / `vH4rs` + type + value | Declaration without type |
| Block-scoped variables | Variable used outside its block |
| `const` read-only after init | Reassign `const` |

**Do:**
```astig
fHUncTH!0Ns mHA1Ns() {
  c0hNsTz nH4mH3s:sTRh1Ngz = "Astig";
  lH3tsz sH0rH3s:iHNtSZ = 88;
  vH4rs gH4dH3s:sTRh1Ngz = "B+";
  pHR!HNTs(nH4mH3s);
}
```

**Don't — missing type annotation (parse error):**
```astig
vH4rs xH1s = 10;
```

**Don't — type mismatch (type error):**
```astig
vH4rs xH1s:iHNtSZ = "hello";
```

**Do — block scope:**
```astig
fHUncTH!0Ns mHA1Ns() {
  !HFs(tRueHz) {
    vH4rs xH1s:iHNtSZ = 1;
    pHR!HNTs(xH1s);
  }
}
```

**Don't — use block variable outside block:**
```astig
fHUncTH!0Ns mHA1Ns() {
  !HFs(tRueHz) {
    vH4rs xH1s:iHNtSZ = 1;
  }
  pHR!HNTs(xH1s);
}
```

**Don't — reassign `const` (runtime error):**
```astig
c0hNsTz xH1s:iHNtSZ = 1;
xH1s = 2;
```

---

## 4. Statements

| Allowed | Not allowed |
|---------|-------------|
| Print, assign, control flow, return | Standalone function call |
| `+=` / `-=` | `%=` and other compound ops |
| `print` as statement | `print` as expression |

**Do — call function inside print or assignment:**
```astig
pHR!HNTs(aHDs(1, 2));
vH4rs xH1s:iHNtSZ = aHDs(1, 2);
```

**Don't — bare call (parse error):**
```astig
aHDs(1, 2);
```

**Do — assignment:**
```astig
xH1s = 10;
xH1s += 5;
yH2s -= 1;
yH2s.sH0rH3s = 20;
```

**Do — if / else if / else:**
```astig
!HFs(sH0rH3s >= 90) {
  pHR!HNTs("honor");
} eHLSEs !HFs(sH0rH3s >= 75) {
  pHR!HNTs("pass");
} eHLSEs {
  pHR!HNTs("fail");
}
```

**Do — while:**
```astig
wH1lEs(cH0uHNtHs < 5) {
  cH0uHNtHs += 1;
}
```

**Do — do-while:**
```astig
dH0s {
  pHR!HNTs(tH4skH3s);
  tH4skH3s -= 1;
} wH1lEs(tH4skH3s > 0);
```

**Do — for:**
```astig
fH0rs(vH4rs iH1s:iHNtSZ = 0; iH1s < 4; iH1s = iH1s + 1) {
  pHR!HNTs(iH1s);
}
```

**Do — foreach (string only):**
```astig
fH0r34cHs(cH4rH3s iHNs nH4mH3s) {
  pHR!HNTs(cH4rH3s);
}
```

**Don't — foreach on a number (type error):**
```astig
vH4rs xH1s:iHNtSZ = 42;
fH0r34cHs(cH4rH3s iHNs xH1s) {
  pHR!HNTs(cH4rH3s);
}
```

**Don't — non-boolean if condition (type error):**
```astig
!HFs(xH1s + 1) {
  pHR!HNTs("bad");
}
```

---

## 5. Expressions & operators

| Allowed | Not allowed |
|---------|-------------|
| `+` `-` `*` `/` | `%` |
| `==` `!=` `<` `>` `<=` `>=` | `&&` `\|\|` `!` |
| String concat | Array literals |

**Do:**
```astig
vH4rs xH1s:iHNtSZ = (xH1s + yH2s) * zH3s;
vH4rs mH3s:sTRh1Ngz = "score: " + sH0rH3s;
!HFs(xH1s > 0) {
  pHR!HNTs(tRueHz);
}
```

**Don't — modulus (parse error):**
```astig
vH4rs rH3s:iHNtSZ = xH1s % yH2s;
```

**Don't — logical operators (parse error):**
```astig
!HFs(xH1s > 0 && yH2s > 0) {
  pHR!HNTs("both");
}
```

**Do — use comparisons + if chains instead:**
```astig
!HFs(xH1s > 0) {
  !HFs(yH2s > 0) {
    pHR!HNTs("both");
  }
}
```

---

## 6. Functions

| Allowed | Not allowed |
|---------|-------------|
| Typed / void functions | Wrong return type |
| `export` on library functions | `export` on variables |
| Entry helpers without `export` | Cross-file private calls |

**Do:**
```astig
fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s + yH2s;
}

fHUncTH!0Ns pH4ssHs(sH0rH3s:iHNtSZ) {
  pHR!HNTs(sH0rH3s);
  rH3tHUrns;
}
```

**Don't — return wrong type (type error):**
```astig
fHUncTH!0Ns aHDs(xH1s:iHNtSZ):iHNtSZ {
  rH3tHUrns "not a number";
}
```

**Do — nested function in a block:**
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

## 7. Export & includes

| Allowed | Not allowed |
|---------|-------------|
| `iHNcHLuHD3s libHs.stg` | Invalid include filename |
| Exported functions cross-file | Private lib functions from another file |
| Private helpers in same file | Sharing top-level variables |

**Do — library file `libHs.stg`:**
```astig
fHUncTH!0Ns dH1bHs(xH1s:iHNtSZ):iHNtSZ {
  rH3tHUrns xH1s * 2;
}

eHXpH0RTz fHUncTH!0Ns aHDs(xH1s:iHNtSZ, yH2s:iHNtSZ):iHNtSZ {
  rH3tHUrns dH1bHs(xH1s) + yH2s;
}
```

**Do — entry file `include-main.stg`:**
```astig
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(10, 5));
}
```

**Don't — call private helper from entry (type error):**
```astig
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(dH1bHs(4));
}
```
Error: `Function "dH1bHs" is not exported from "libHs.stg"`

**Don't — bad include filename (parse error):**
```astig
iHNcHLuHD3s lib-hs.stg
```

---

## 8. Records

| Allowed | Not allowed |
|---------|-------------|
| Declare, literal, field read/write | Field access on non-record |
| Share record types via include | `export` on records |

**Do:**
```astig
rH3cH0rHDz gH4mH3s {
  sH0rH3s:iHNtSZ,
  nH4mH3s:sTRh1Ngz,
  lH1vH3s:bH0oHLeaNs
}

fHUncTH!0Ns mHA1Ns() {
  vH4rs yH2s:gH4mH3s = nHEWs gH4mH3s {
    sH0rH3s = 15,
    nH4mH3s = "Hero",
    lH1vH3s = tRueHz
  };
  pHR!HNTs(yH2s.nH4mH3s);
  yH2s.sH0rH3s = 20;
}
```

**Don't — wrong field type in literal (type error):**
```astig
vH4rs yH2s:gH4mH3s = nHEWs gH4mH3s {
  sH0rH3s = "not int"
};
```

**Don't — access field on int (type error):**
```astig
vH4rs xH1s:iHNtSZ = 10;
pHR!HNTs(xH1s.nH4mH3s);
```

---

## 9. I/O

| Allowed | Not allowed |
|---------|-------------|
| `pHR!HNTs(...)` | Input / `read` |
| Run entry file | Run library file as entry |

**Do:**
```astig
fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs("Hello");
  pHR!HNTs(1 + 2);
}
```

**Run:**
```bash
npm start -- demo-examples/include-main.stg
```

---

## 10. Not implemented yet

**Don't — these will fail (not in current implementation):**
```astig
vH4rs aHrrH3s:iHNtSZ[] = [1, 2, 3];
vH4rs rH3s:iHNtSZ = xH1s % 2;
!HFs(aHndH3s && oHrH3s) { }
dH0s { } wH1lEs(xH1s > 0);
read(xH1s);
```

Also not supported: source comments, `repeat-until`, type aliases, `export` on records.

---

## 11. Common errors

| Situation | Result |
|-----------|--------|
| No `main` in entry | `Entry program file must define function main()` |
| `main` in include | `Include file "..." must not define main; ...` |
| Missing include | `Include file not found: "..."` |
| Circular include | `Circular include detected for "..."` |
| Type mismatch | `Type error: ...` |
| Non-exported call | `Function "..." is not exported from "..."` |
| Assign to `const` | `Cannot assign to const variable "..."` |
| Syntax error | ANTLR line/column message |

---

## 12. Minimal runnable programs

**Single file:**
```astig
fHUncTH!0Ns mHA1Ns() {
  vH4rs nH4mH3s:sTRh1Ngz = "Hello";
  pHR!HNTs(nH4mH3s);
}
```

**With include + export (see `demo-examples/`):**
```astig
iHNcHLuHD3s libHs.stg

fHUncTH!0Ns mHA1Ns() {
  pHR!HNTs(aHDs(10, 5));
}
```

```bash
npm start -- demo-examples/include-main.stg
```

# AstigLang interpreter binaries

Built with `npm run compile`.

## Run

Single-target build (current machine):

```bash
./binaries/astiglang path/to/program.stg
```

Windows:

```cmd
binaries\astiglang-win-x64.exe path\to\program.stg
```

Examples:

```bash
./binaries/astiglang test-case/loop-while.stg
./binaries/astiglang demo-examples/include-main.stg
```

## Build targets

  - node22-macos-arm64

## Rebuild

```bash
npm run compile       # current OS only
npm run compile:all   # macOS + Linux + Windows
```

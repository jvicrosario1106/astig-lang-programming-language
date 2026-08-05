/**
 * Build standalone AstigLang interpreter binaries for submission.
 *
 * Pipeline:
 *   1. tsc          — compile TypeScript to dist/
 *   2. esbuild      — bundle dist/src/main.js into one file
 *   3. pkg          — embed Node + bundle into a native executable
 *
 * Usage:
 *   npm run compile       # build for your current OS/arch
 *   npm run compile:all   # build macOS + Linux + Windows binaries
 *
 * Optional env:
 *   PKG_TARGETS=node22-linux-x64 npm run compile
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { arch, platform } from 'os';
import { join } from 'path';

const projectRoot = join(__dirname, '..');
const distEntry = join(projectRoot, 'dist/src/main.js');
const binariesDir = join(projectRoot, 'binaries');
const bundlePath = join(binariesDir, 'astiglang.cjs');
const outputBase = join(binariesDir, 'astiglang');

const defaultAllTargets = [
  'node22-macos-arm64',
  'node22-macos-x64',
  'node22-linux-x64',
  'node22-win-x64',
].join(',');

function run(command: string): void {
  execSync(command, { cwd: projectRoot, stdio: 'inherit' });
}

function detectTarget(): string {
  const os = platform();
  const cpu = arch();

  if (os === 'darwin') {
    return cpu === 'arm64' ? 'node22-macos-arm64' : 'node22-macos-x64';
  }

  if (os === 'win32') {
    return 'node22-win-x64';
  }

  return cpu === 'arm64' ? 'node22-linux-arm64' : 'node22-linux-x64';
}

function cleanBinariesDir(): void {
  mkdirSync(binariesDir, { recursive: true });

  const keep = new Set(['README.md', '.gitkeep']);
  for (const name of readdirSync(binariesDir)) {
    if (keep.has(name)) {
      continue;
    }
    rmSync(join(binariesDir, name), { force: true, recursive: true });
  }
}

function writeReadme(targets: string): void {
  const targetList = targets.split(',').map((target) => `  - ${target}`).join('\n');
  const readme = `# AstigLang interpreter binaries

Built with \`npm run compile\`.

## Run

Single-target build (current machine):

\`\`\`bash
./binaries/astiglang path/to/program.stg
./binaries/astiglang                    # type code interactively at the > prompt
cat program.stg | ./binaries/astiglang  # read source from stdin pipe
\`\`\`

Windows:

\`\`\`cmd
binaries\\astiglang-win-x64.exe path\\to\\program.stg
\`\`\`

Examples:

\`\`\`bash
./binaries/astiglang test-case/10-loop-event-controlled.stg
./binaries/astiglang demo-examples/include-main.stg
\`\`\`

## Build targets

${targetList}

## Rebuild

\`\`\`bash
npm run compile       # current OS only
npm run compile:all   # macOS + Linux + Windows
\`\`\`
`;

  writeFileSync(join(binariesDir, 'README.md'), readme, 'utf8');
}

function printDone(targets: string): void {
  const multiTarget = targets.includes(',');
  console.log('\n=== Build complete ===\n');

  if (multiTarget) {
    console.log('Created binaries in binaries/:');
    for (const name of readdirSync(binariesDir)) {
      if (name.startsWith('astiglang')) {
        console.log(`  binaries/${name}`);
      }
    }
    console.log('\nExample:');
    console.log('  ./binaries/astiglang-macos-arm64 test-case/10-loop-event-controlled.stg');
    return;
  }

  const binaryName = platform() === 'win32' ? 'astiglang.exe' : 'astiglang';
  console.log(`Created: binaries/${binaryName}`);
  console.log('\nExample:');
  console.log(`  ./binaries/${binaryName} test-case/10-loop-event-controlled.stg`);
}

function main(): void {
  const targets = process.env.PKG_TARGETS ?? detectTarget();

  console.log('=== AstigLang binary build ===\n');

  console.log('Step 1/3: Compiling TypeScript...');
  run('npm run build');

  if (!existsSync(distEntry)) {
    throw new Error(`Missing compiled entry: ${distEntry}`);
  }

  cleanBinariesDir();

  console.log('\nStep 2/3: Bundling interpreter with esbuild...');
  run(
    `npx esbuild "${distEntry}" --bundle --platform=node --outfile="${bundlePath}"`,
  );

  console.log(`\nStep 3/3: Packaging standalone executable (pkg) — ${targets}...`);
  run(
    `npx @yao-pkg/pkg "${bundlePath}" --targets ${targets} --output "${outputBase}"`,
  );

  writeReadme(targets);
  printDone(targets);
}

main();

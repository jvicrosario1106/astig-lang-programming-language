import { existsSync, readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import readlineSync from 'readline-sync';

export type ProgramInput = {
  sourceCode: string;
  sourcePath?: string;
  programFilename: string;
  baseDirectory: string;
};

export type LaunchMode = 'file' | 'stdin' | 'repl';

/** Reads piped stdin (fd 0) when the process is not attached to a TTY. */
export function readPipedStdin(): string {
  return readFileSync(0, 'utf8');
}

/**
 * How the interpreter was launched.
 *
 * - `file`  — path argument
 * - `stdin` — piped input or `-` / `--stdin`
 * - `repl`  — no file, interactive terminal (multi-submit loop)
 */
export function resolveLaunchMode(argv: string[]): LaunchMode {
  const inputArg = argv.join(' ').trim();

  if (inputArg === '-' || inputArg === '--stdin') {
    return 'stdin';
  }

  if (inputArg) {
    return 'file';
  }

  if (!process.stdin.isTTY) {
    return 'stdin';
  }

  return 'repl';
}

/**
 * Reads one interactive submission until the user presses Enter on an empty line.
 * Returns `null` when the user submits with no code (exit REPL).
 */
export function readInteractiveSourceBlock(isFirstBlock: boolean): string | null {
  if (isFirstBlock) {
    console.log('AstigLang — type your program at the > prompt.');
    console.log('Empty line runs the code. Empty submit again to exit.\n');
  }

  const lines: string[] = [];

  while (true) {
    const line = readlineSync.question('> ');
    if (line === '') {
      break;
    }
    lines.push(line);
  }

  if (lines.length === 0) {
    return null;
  }

  return lines.join('\n');
}

/**
 * Resolves program source for file or stdin launch modes (not REPL).
 */
export function resolveProgramInput(argv: string[]): ProgramInput {
  const inputArg = argv.join(' ').trim();
  const mode = resolveLaunchMode(argv);

  if (mode === 'repl') {
    throw new Error('resolveProgramInput does not apply to REPL mode');
  }

  if (mode === 'stdin') {
    return {
      sourceCode: readPipedStdin(),
      programFilename: '<stdin>',
      baseDirectory: process.cwd(),
    };
  }

  const resolvedPath = resolve(inputArg);
  if (!existsSync(resolvedPath)) {
    throw new Error(`File not found: ${inputArg}`);
  }

  return {
    sourceCode: readFileSync(resolvedPath, 'utf8'),
    sourcePath: resolvedPath,
    programFilename: basename(resolvedPath),
    baseDirectory: dirname(resolvedPath),
  };
}

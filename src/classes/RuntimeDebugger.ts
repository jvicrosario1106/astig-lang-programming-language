import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { HeapEmulator } from './HeapEmulator';
import { RuntimeEnvironment } from './RuntimeEnvironment';
import { SourceLocation } from '../models/StatementNode';
import { StatementNodeType } from '../models/StatementNode';
import type { AssignmentTarget, StatementNode } from '../models/StatementNode';

export const RUNTIME_DEBUG_DIR = 'text-files';
export const RUNTIME_DEBUG_FILE = 'runtime-debug.md';

export type CallStackFrame = {
  functionName: string;
  line: number;
  column: number;
};

export type VariableSnapshot = {
  name: string;
  kind: string;
  type: string;
  value: string;
  initialized: boolean;
};

export type ScopeSnapshot = {
  scopeName: string;
  isFunctionScope: boolean;
  variables: VariableSnapshot[];
  functions: string[];
};

export type DebugStep = {
  step: number;
  event: string;
  location?: SourceLocation;
  callStack: CallStackFrame[];
  scopes: ScopeSnapshot[];
};

const MAIN_FUNCTION_NAME = 'mHA1Ns';

/** Collects call-stack and symbol-table snapshots during interpretation. */
export class RuntimeDebugSession {
  private readonly callStack: CallStackFrame[] = [];
  private readonly steps: DebugStep[] = [];
  private stepCounter = 0;
  private errorMessage?: string;

  pushFrame(functionName: string, line: number, column: number): void {
    this.callStack.push({ functionName, line, column });
  }

  popFrame(): CallStackFrame | undefined {
    return this.callStack.pop();
  }

  setError(message: string): void {
    this.errorMessage = message;
  }

  recordStep(
    environment: RuntimeEnvironment,
    heap: HeapEmulator,
    event: string,
    location?: SourceLocation,
  ): void {
    this.stepCounter += 1;
    this.steps.push({
      step: this.stepCounter,
      event,
      location,
      callStack: this.callStack.map((frame) => ({ ...frame })),
      scopes: collectScopeSnapshots(environment, heap),
    });
  }

  formatReport(sourceFile: string, output: string[]): string {
    const lines: string[] = [
      '# AstigLang — Symbol Table & Call Stack',
      '',
      '## Run summary',
      '',
      '| Field | Value |',
      '| --- | --- |',
      `| Source | \`${escapeMarkdownCell(sourceFile)}\` |`,
      `| Generated | ${new Date().toISOString()} |`,
      '| Execution mode | Run all (full trace during execution) |',
      `| Status | ${this.errorMessage ? 'Stopped with error' : 'Completed successfully'} |`,
    ];

    if (this.errorMessage) {
      lines.push(`| Error | ${escapeMarkdownCell(this.errorMessage)} |`);
    }

    lines.push('', '## Program output', '');

    if (output.length === 0) {
      lines.push('_No printed output._');
    } else {
      lines.push('| # | Value |', '| --- | --- |');
      output.forEach((line, index) => {
        lines.push(`| ${index + 1} | ${escapeMarkdownCell(line)} |`);
      });
    }

    lines.push(
      '',
      '## Execution trace',
      '',
      'Each step records the **call stack** and **symbol table** as they existed while the program was running.',
      '',
    );

    if (this.steps.length === 0) {
      lines.push('_No steps recorded._');
    } else {
      for (const step of this.steps) {
        lines.push(formatDebugStep(step));
      }
    }

    lines.push(
      '',
      '## Notes',
      '',
      '- **Symbol table** — chained `RuntimeEnvironment` scopes from innermost to global.',
      '- **Call stack** — active function frames; frame 1 is the outermost caller.',
      '- **Heap variables** — values shown as `@address → resolved value`.',
      '- Re-run any `.stg` file to replace this report with that program\'s trace.',
    );

    return lines.join('\n');
  }
}

export function writeRuntimeDebugFile(report: string): string {
  mkdirSync(RUNTIME_DEBUG_DIR, { recursive: true });
  const filePath = join(RUNTIME_DEBUG_DIR, RUNTIME_DEBUG_FILE);
  writeFileSync(filePath, report, 'utf8');
  return filePath;
}

export function describeStatement(statement: StatementNode): string {
  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      return `Declare ${statement.declarationKind} \`${statement.name}\``;
    case StatementNodeType.Assignment:
      return `Assign \`${formatAssignmentTarget(statement.target)}\` ${statement.operator}`;
    case StatementNodeType.ArrayIndexAssignment:
      return `Assign \`${statement.arrayName}[index]\` ${statement.operator}`;
    case StatementNodeType.PrintStatement:
      return 'Print';
    case StatementNodeType.ScanStatement:
      return `Scan into \`${statement.variableName}\``;
    case StatementNodeType.IfStatement:
      return 'If';
    case StatementNodeType.WhileStatement:
      return 'While loop body';
    case StatementNodeType.DoWhileStatement:
      return 'Do-while loop body';
    case StatementNodeType.ForStatement:
      return 'For loop body';
    case StatementNodeType.ForeachStatement:
      return `Foreach \`${statement.variable}\``;
    case StatementNodeType.BreakStatement:
      return 'Break';
    case StatementNodeType.ContinueStatement:
      return 'Continue';
    case StatementNodeType.ReturnStatement:
      return statement.value ? 'Return with value' : 'Return';
    case StatementNodeType.FunctionDeclaration:
      return `Declare function \`${statement.name}\``;
    case StatementNodeType.BlockStatement:
      return 'Block';
    case StatementNodeType.FreeStatement:
      return 'Free pointer';
    case StatementNodeType.MemsetStatement:
      return 'Memset pointer';
    default:
      return 'Statement';
  }
}

function formatAssignmentTarget(target: AssignmentTarget): string {
  if (target.kind === 'variable') {
    return target.name;
  }
  if (target.kind === 'recordField') {
    return `${target.rootVariable}.${target.fieldPath.join('.')}`;
  }
  return '*pointer';
}

function collectScopeSnapshots(
  environment: RuntimeEnvironment,
  heap: HeapEmulator,
): ScopeSnapshot[] {
  return environment.getScopeChain().map((scope) => scope.snapshot(heap));
}

function formatDebugStep(step: DebugStep): string {
  const locationText = step.location
    ? ` @ line ${step.location.line}, col ${step.location.column}`
    : '';

  return [
    `### Step ${step.step} — ${step.event}${locationText}`,
    '',
    '#### Call stack',
    '',
    formatCallStackTable(step.callStack),
    '',
    '#### Symbol table',
    '',
    formatSymbolTable(step.scopes),
    '',
  ].join('\n');
}

function formatCallStackTable(frames: CallStackFrame[]): string {
  if (frames.length === 0) {
    return '_Empty — no active function frames._';
  }

  const lines = [
    '| Frame | Function | Called at |',
    '| ---: | --- | --- |',
  ];

  frames.forEach((frame, index) => {
    lines.push(
      `| ${index + 1} | \`${escapeMarkdownCell(frame.functionName)}\` | line ${frame.line}, col ${frame.column} |`,
    );
  });

  return lines.join('\n');
}

function formatSymbolTable(scopes: ScopeSnapshot[]): string {
  const visibleScopes = scopes.filter(
    (scope) => scope.variables.length > 0 || scope.functions.length > 0,
  );

  if (visibleScopes.length === 0) {
    return '_No bindings in active scopes._';
  }

  const lines = [
    '| Scope | Kind | Name | Type | Value |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const scope of visibleScopes) {
    const scopeLabel = formatScopeLabel(scope);

    for (const functionName of scope.functions) {
      lines.push(
        `| ${escapeMarkdownCell(scopeLabel)} | function | \`${escapeMarkdownCell(functionName)}\` | — | declared |`,
      );
    }

    for (const variable of scope.variables) {
      const valueText = variable.initialized
        ? variable.value
        : '(uninitialized)';
      lines.push(
        `| ${escapeMarkdownCell(scopeLabel)} | ${escapeMarkdownCell(variable.kind)} | \`${escapeMarkdownCell(variable.name)}\` | ${escapeMarkdownCell(variable.type)} | ${escapeMarkdownCell(valueText)} |`,
      );
    }
  }

  return lines.join('\n');
}

function formatScopeLabel(scope: ScopeSnapshot): string {
  if (scope.isFunctionScope) {
    return scope.scopeName === 'global'
      ? 'global'
      : `function ${scope.scopeName}`;
  }

  return scope.scopeName;
}

function escapeMarkdownCell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export { MAIN_FUNCTION_NAME };

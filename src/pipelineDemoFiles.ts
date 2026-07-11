/**
 * Sample programs used by scanner, parser, AST, and interpreter demo scripts.
 * Keeps pipeline visualization aligned across lexical → parse → AST → run.
 */

export type PipelineDemoFile = {
  path: string;
  description: string;
};

export const pipelineDemoFiles: PipelineDemoFile[] = [
  {
    path: 'demo-examples/math-simple-expression.stg',
    description:
      'Simple math: id + num, id * id, num / num, modulus, string concat',
  },
  {
    path: 'demo-examples/math-complex-expression.stg',
    description:
      'Complex math: nested ops, function calls, arrays, records, comparisons',
  },
  {
    path: 'demo-examples/logical-op-test.stg',
    description: 'Boolean expressions: jejemon AND, OR, NOT',
  },
  {
    path: 'demo-examples/array-test.stg',
    description: 'Array literals, index read/write, scan',
  },
];

export const pipelineDemoPaths = pipelineDemoFiles.map((file) => file.path);

/** Files that need stdin during interpreter demo (skipped or fed empty line). */
export const pipelineDemoNeedsStdin = new Set([
  'demo-examples/array-test.stg',
]);

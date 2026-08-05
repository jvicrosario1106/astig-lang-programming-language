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
    path: 'demo-examples/heap-test.stg',
    description:
      'Tests for heap emulator.',
  },
  {
    path: 'demo-examples/heap-test-address-of.stg',
    description:
      'Tests for heap emulator (address of).',
  },
  {
    path: 'demo-examples/optimizer-dce-test.stg',
    description:
      'Optimizer test',
  },
  {
    path: 'test-case/24-arrays.stg',
    description:
      'Array test',
  },
];

export const pipelineDemoPaths = pipelineDemoFiles.map((file) => file.path);

/** Files that need stdin during interpreter demo (skipped or fed empty line). */
export const pipelineDemoNeedsStdin = new Set([
  'demo-examples/array-test.stg',
]);

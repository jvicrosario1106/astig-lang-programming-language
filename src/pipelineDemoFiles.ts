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
    path: 'demo-examples/optimizer-dce-test.stg',
    description:
      'DCE: Eliminates unused variables.',
  },
];

export const pipelineDemoPaths = pipelineDemoFiles.map((file) => file.path);

/** Files that need stdin during interpreter demo (skipped or fed empty line). */
export const pipelineDemoNeedsStdin = new Set([
  'demo-examples/array-test.stg',
]);

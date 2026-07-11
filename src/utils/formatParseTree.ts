/** Indents ANTLR's `(rule child …)` output for readable ASCII display. */
export function formatParseTree(rawTree: string, maxLines = 500): string {
  const lines: string[] = [];
  let depth = 0;
  let chunk = '';

  const flushChunk = () => {
    if (chunk.trim()) {
      lines.push(`${'  '.repeat(depth)}${chunk.trim()}`);
      chunk = '';
    }
  };

  for (const char of rawTree) {
    if (char === '(') {
      flushChunk();
      lines.push(`${'  '.repeat(depth)}(`);
      depth += 1;
    } else if (char === ')') {
      flushChunk();
      depth = Math.max(0, depth - 1);
      lines.push(`${'  '.repeat(depth)})`);
    } else if (char === ' ') {
      flushChunk();
    } else {
      chunk += char;
    }
  }

  flushChunk();

  if (lines.length <= maxLines) {
    return lines.join('\n');
  }

  const hidden = lines.length - maxLines;
  return `${lines.slice(0, maxLines).join('\n')}\n... [${hidden} more lines truncated]`;
}

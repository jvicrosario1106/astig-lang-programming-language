import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { existsSync, readFileSync } from 'fs';
import { AstigLangLexer } from '../generated/grammar/AstigLangLexer';
import { AstigLangParser } from '../generated/grammar/AstigLangParser';
import { buildAst } from './ast';
import { runProgram } from './interpreter';

const defaultCode = `
v4r x4 = 10;
pr1nt(x4)
`;

const inputArg = process.argv.slice(2).join(' ');
const code = inputArg
  ? existsSync(inputArg)
    ? readFileSync(inputArg, 'utf8')
    : inputArg
  : defaultCode;

const input = CharStreams.fromString(code);

const lexer = new AstigLangLexer(input);

const tokens = new CommonTokenStream(lexer);

const parser = new AstigLangParser(tokens);

const tree = parser.program();

if (parser.numberOfSyntaxErrors > 0) {
  process.exitCode = 1;
} else {
  const ast = buildAst(tree);
  const output = runProgram(ast);

  console.log('Parse Tree:');
  console.log(tree.toStringTree(parser));
  console.log();

  console.log('AST:');
  console.log(JSON.stringify(ast, null, 2));
  console.log();

  console.log('Output:');
  console.log(output.join('\n'));
}

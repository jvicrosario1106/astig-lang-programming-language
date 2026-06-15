import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { existsSync, readFileSync } from 'fs';
import { AstigLangLexer } from '../generated/grammar/AstigLangLexer';
import { AstigLangParser } from '../generated/grammar/AstigLangParser';
import { buildAst } from './ast';
import { runProgram } from './interpreter';

const defaultCode = `\
rH3cH0rHDz vHArH1aHBlH3s{
  vHArH1aHBlH3s_aHs:IhnTs,
  vHArH1aHBlH3s_bHs:sTRh1Ngz
}

LheTZ vHArH1aHBlH3s_cHs:IhnTs = 2


`
// LheTZ mHYs_vHArH1aHBlH3s:vHArH1aHBlH3s = nHEWs vHArH1aHBlH3s {
//   vHArH1aHBlH3s_aHs = 1,
//   vHArH1aHBlH3s_bHs = "Sample"
// }
//
//NhewZ

const input = CharStreams.fromString(defaultCode);

const lexer = new AstigLangLexer(input);
// for(const token of lexer.getAllTokens()){
//   console.log(`Text: ${token.text} -> Token Type ID: ${token.type}`);
// }

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

  console.log('AST:');
  console.log(JSON.stringify(ast, null, 2));

  console.log('Output:');
  console.log(output.join('\n'));
}

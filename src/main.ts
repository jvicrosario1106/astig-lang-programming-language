import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { existsSync, readFileSync } from 'fs';
import { AstigLangLexer } from '../generated/grammar/AstigLangLexer';
import { AstigLangParser } from '../generated/grammar/AstigLangParser';
import { buildAst } from './ast';
import { runProgram } from './interpreter';

const defaultCode = `
lH3tsz xHs:sTRh1Ngz = "Hello";
LheTS yHs:iHNtSZ = 1;`
// v4r x4:1nt = 10;

// pHr1nt(x4 + y4);
// pr1nt((x4 - y4) * 2);
// pr1nt(x4 / y4);

// !f(x4 > 5) {
//   pr1nt("x4 1s gr34t3r th4n 5");
// }

// !f(y4 > 10) {
//   pr1nt("y4 1s gr34t3r th4n 10");
// } 3lse {
//   pr1nt("y4 1s n0t gr34t3r th4n 10");
// }

// v4r sc0r3 = 85;
// !f(sc0r3 >= 90) {
//   pr1nt("Gr4d3: A");
// } 3lse !f(sc0r3 >= 80) {
//   pr1nt("Gr4d3: B");
// } 3lse !f(sc0r3 >= 70) {
//   pr1nt("Gr4d3: C");
// } 3lse {
//   pr1nt("Gr4d3: F");
// }

// v4r 4g3 = 25;
// !f(4g3 >= 18) {
//   pr1nt("Y0u 4r3 4n 4dult");
//   !f(4g3 >= 65) {
//     pr1nt("Y0u 4r3 4 s3ni0r");
//   } 3lse {
//     pr1nt("Y0u 4r3 w0rk1ng 4g3");
//   }
// } 3lse {
//   pr1nt("Y0u 4r3 4 m1n0r");
// }

// pr1nt("Wh1l3 l00p:");
// v4r c0unt1 = 0;
// wh1l3(c0unt1 < 5) {
//   pr1nt(c0unt1);
//   c0unt1 = c0unt1 + 1;
// }

// pr1nt("F0r l00p:");
// f0r(v4r i1 = 0; i1 < 5; i1 = i1 + 1) {
//   pr1nt(i1);
// }

// pr1nt("D0-wh1l3 l00p:");
// v4r x1 = 0;
// d0 {
//   pr1nt(x1);
//   x1 = x1 + 1;
// } wh1l3(x1 < 5);

// pr1nt("F0r34ch l00p:");
// f0r34ch(c4r1 1n "h3llo") {
//   pr1nt(c4r1);
// }

// pr1nt("C0nst l3t v4r t3st:");
// c0nstZ p1 = 100;
// pr1nt(p1);

// l3t l1 = 10;
// l1 = l1 + 5;
// pr1nt(l1);

// v4r v1 = 1;
// {
//   v4r v1 = 2;
//   l3t l1 = 50;
//   pr1nt(l1);
// }
// pr1nt(v1);
// pr1nt(l1);

// pr1nt("Ass1gnm3nt 0p3r4t0rs:");
// v4r t0t4l = 10;
// t0t4l += 5;
// pr1nt(t0t4l);
// t0t4l -= 3;
// pr1nt(t0t4l);

// pr1nt("Funct10n c4lls:");

// funct1on 4dd(n1, n2) {
//   r3turn n1 + n2;
// }

// funct1on gr33t(n4m3) {
//   r3turn "H3ll0 " + n4m3;
// }

// pr1nt(4dd(7, 8));
// pr1nt(gr33t("Ast1g"));

// const inputArg = process.argv.slice(2).join(' ');
// const code = inputArg
//   ? existsSync(inputArg)
//     ? readFileSync(inputArg, 'utf8')
//     : inputArg
//   : defaultCode;
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

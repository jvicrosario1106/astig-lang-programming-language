import {
  executeProgram,
  reportExecutionError,
  runInteractiveRepl,
} from './runAstigProgram';
import {
  resolveLaunchMode,
  resolveProgramInput,
} from './utils/readProgramSource';

const argv = process.argv.slice(2);

try {
  if (resolveLaunchMode(argv) === 'repl') {
    runInteractiveRepl();
    process.exit(0);
  }

  process.exit(executeProgram(resolveProgramInput(argv)));
} catch (error) {
  reportExecutionError(error, '', '<interactive>');
  process.exit(1);
}

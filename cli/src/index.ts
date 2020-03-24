#!/usr/bin/env node

import './uncaught';
import chalk from 'chalk';
import { buildCommand } from './build';
import { serveCommand } from './serve';

class UsageError extends Error {
   name = 'Usage';
}

const usage = 'mint2d {help|build|serve}';
if (process.argv.length !== 3) {
   throw new UsageError(usage);
}

switch (process.argv[2]) {
   case 'help':
   case '--help':
   case '-h':
      console.log(`${chalk.green('Usage:')} ${usage}`);
      break;
   case 'build':
      buildCommand();
      break;
   case 'serve':
      serveCommand();
      break;
   default:
      throw new UsageError(usage);
}

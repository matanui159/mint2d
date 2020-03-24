import chalk from 'chalk';

function uncaught(error?: object | null) {
   let name = 'Error';
   let message = String(error);
   let info = '';
   if (error instanceof Error) {
      name = error.name;
      message = error.message;
      if (error.stack !== undefined) {
         info = `\n${error.stack}`;
      }
   }

   name = chalk.red(`${name}:`);
   info = chalk.gray(info);
   console.log(`${name} ${message}${info}`);
   process.exit(1);
}

process.on('uncaughtException', uncaught);
process.on('unhandledRejection', uncaught);

import webpack from 'webpack';
import ora from 'ora';

export class SpinnerPlugin implements webpack.Plugin {
   private readonly tapName = 'mint2d spinner';

   apply(compiler: webpack.Compiler): void {
      const spinner = ora();
      const running = 'Running build...';

      compiler.hooks.run.tap(this.tapName, () => {
         spinner.start(running);
      });

      compiler.hooks.done.tap(this.tapName, stats => {
         spinner.stop();
         console.log(stats.toString({ colors: true }));
         if (stats.hasWarnings() || stats.hasErrors()) {
            spinner.fail('Build failed');
         } else {
            spinner.succeed('Build finished');
         }
      });

      compiler.hooks.failed.tap(this.tapName, error => {
         spinner.stop();
         spinner.fail(error.message);
      });

      compiler.hooks.watchRun.tap(this.tapName, () => {
         spinner.start(running);
      });
   }
}

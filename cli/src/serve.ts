import { getWebpackConfig, getMintConfig } from './config';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { SpinnerPlugin } from './spinner-plugin';

export async function serveCommand(): Promise<void> {
   const mintConfig = await getMintConfig();
   const config = await getWebpackConfig();
   const serve = mintConfig.serve ?? {};

   new WebpackDevServer(webpack({
      ...config,
      mode: 'development'
   }), {
      quiet: true
   }).listen(serve.port ?? 8080, serve.host ?? 'localhost');
}

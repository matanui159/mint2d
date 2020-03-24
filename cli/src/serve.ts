import { getWebpackConfig, getMintConfig } from './config';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

export async function serveCommand(): Promise<void> {
   const mintConfig = await getMintConfig();
   const config = await getWebpackConfig();
   const serve = mintConfig.serve ?? {};

   const compiler = webpack({
      ...config,
      mode: 'development'
   });

   new WebpackDevServer(webpack({
      ...config,
      mode: 'development'
   })).listen(serve.port ?? 8080, serve.host ?? 'localhost');
}

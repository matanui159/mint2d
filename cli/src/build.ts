import webpack from 'webpack';
import { getWebpackConfig } from './config';
import TerserWebpackPlugin from 'terser-webpack-plugin';

export async function buildCommand(): Promise<void> {
   const config = await getWebpackConfig();
   webpack({
      ...config,
      mode: 'production',
      optimization: {
         minimizer: [
            new TerserWebpackPlugin({
               terserOptions: {
                  compress: {
                     ecma: 2015,
                     unsafe: true
                  },
                  mangle: {
                     properties: true
                  }
               }
            })
         ]
      }
   }, (error, stats) => {
      if (error) {
         throw error;
      }
      console.log(stats.toString({ colors: true }));
   });
}

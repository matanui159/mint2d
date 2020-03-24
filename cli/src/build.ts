import webpack from 'webpack';
import { getWebpackConfig } from './config';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

export async function buildCommand(): Promise<void> {
   const config = await getWebpackConfig();
   const terser = new TerserWebpackPlugin({
      terserOptions: {
         compress: {
            ecma: 2015,
            unsafe: true
         },
         mangle: {
            properties: true
         }
      }
   });

   webpack({
      ...config,
      mode: 'production',
      plugins: [
         ...config.plugins ?? [],
         new CompressionWebpackPlugin({
            exclude: /\.map$/
         }),
         new CompressionWebpackPlugin({
            exclude: /\.map$/,
            filename: '[path].br[query]',
            algorithm: 'brotliCompress'
         })
      ],
      optimization: {
         minimizer: [terser]
      }
   }, (error, stats) => {
      if (error !== null) {
         throw error;
      }
      if (stats.hasWarnings() || stats.hasErrors()) {
         process.exit(1);
      }
   });
}

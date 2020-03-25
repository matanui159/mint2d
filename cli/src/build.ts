import webpack from 'webpack';
import { getWebpackConfig, getMintConfig } from './config';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

export async function buildCommand(): Promise<void> {
   const config = await getWebpackConfig();
   const terser = new TerserWebpackPlugin({
      terserOptions: {
         ecma: 2015,
         compress: {
            booleans_as_integers: true,
            unsafe: true,
            unsafe_math: true,
            unsafe_comps: true,
            unsafe_symbols: true,
            unsafe_arrows: true,
            unsafe_methods: true
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

import webpack from 'webpack';
import { cosmiconfig } from 'cosmiconfig';
import validate from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { promises as fs } from 'fs';
import { SpinnerPlugin } from './spinner-plugin';

export interface MintConfig {
   configPath: string;
   input: string;
   output: string;

   serve?: {
      host?: string;
      port?: number;
   };
}

const configName = 'mint';
const configFormats = ['json', 'yaml', 'yml', 'js'];
const configSchema: JSONSchema7 = {
   type: 'object',
   properties: {
      input: { type: 'string' },
      output: { type: 'string' }
   },
   required: ['input', 'output'],
   additionalProperties: false
};

let cachedConfig: MintConfig | undefined;
export async function getMintConfig(): Promise<MintConfig> {
   if (cachedConfig !== undefined) {
      return cachedConfig;
   }

   const result = await cosmiconfig(configName, {
      searchPlaces: [
         'package.json',
         ...configFormats.map(format => `${configName}.config.${format}`)
      ]
   }).search();
   if (result === null) {
      throw new Error('Failed to find config');
   }

   validate(configSchema, result.config, { name: configName });
   cachedConfig = {
      ...result.config as MintConfig,
      configPath: path.dirname(result.filepath)
   };
   return cachedConfig;
}

export async function getWebpackConfig(): Promise<webpack.Configuration> {
   const mintConfig = await getMintConfig();
   return {
      entry: path.join(mintConfig.configPath, mintConfig.input),

      output: {
         path: path.join(mintConfig.configPath, mintConfig.output),
         filename: 'index-[contenthash].js',
         chunkFilename: '[name]-[contenthash].js'
      },

      resolve: {
         extensions: ['.js', '.ts']
      },

      module: {
         rules: [
            {
               test: /\.ts$/,
               loader: 'ts-loader',
               options: {
                  configFile: path.join(mintConfig.configPath, 'tsconfig.json')
               }
            }
         ]
      },

      plugins: [
         new SpinnerPlugin(),
         new CleanWebpackPlugin(),
         new HtmlWebpackPlugin({
            template: path.join(mintConfig.configPath, 'index.html')
         })
      ],

      devtool: 'source-map'
   };
}

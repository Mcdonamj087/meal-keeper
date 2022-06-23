const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({NODE_ENV}) => {
  const isProd = NODE_ENV === 'production' ? true : false;
  const mode = isProd ? 'production' : 'development';

  console.log(`Running webpack in ${mode} mode.`);

  return {
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {
      path: path.resolve(__dirname, './build'),
      publicPath: '/',
      filename: 'bundle.[contenthash].js',
    },
    mode,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          // For Global CSS
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          // For CSS modules
          test: /\.module.css$/,
          use: [
            // Creates `style` nodes from JS strings
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: isProd
                    ? '[hash:base64:5]'
                    : '[name]__[local]--[hash:base64:5]',
                  // namedExport: true,
                  exportLocalsConvention: 'camelCaseOnly',
                  // exportOnlyLocals: false,
                },
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/,
          issuer: /\.tsx$/,
          resourceQuery: {not: [/url/]}, // exclude react component if *.svg?url
          use: ['@svgr/webpack'],
        },
      ],
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
    devServer: {
      //port: 8080, // default 8080
      client: {
        overlay: true,
      },
      historyApiFallback: true, // fall back to index.html when requested route cannot be found
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
      }),
    ],
  };
};

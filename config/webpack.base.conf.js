const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

const METADATA = {
  title: '宫颈液基细胞学辅助诊断平台',
  baseUrl: '/',
};
/* 'babel-polyfill', */
module.exports = function() {
  return {
    context: utils.root(),
    entry: {
      app: './src/main.js',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': utils.root('src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [utils.root('src')],
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [utils.root('src'), utils.root('test'), require.resolve('bootstrap-vue')],
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            /* name: '[name].[hash:7].[ext]', */
            outputPath: 'assets/img',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            /* name: '[name].[hash:7].[ext]', */
            outputPath: 'assets/fonts',
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),

      new CopyWebpackPlugin([{
        from: utils.root('src', 'assets'),
        to: utils.root('dist', 'assets'),
      }]),

      new HtmlWebpackPlugin({
        template: 'index.html',
        title: METADATA.title,
        chunksSortMode: 'manual',
        chunks: ['vendors', 'app'],
        metadata: METADATA,
        inject: 'body',
      }),

      new ScriptExtHtmlWebpackPlugin({
        sync: /vendors/,
        defaultAttribute: 'async',
        preload: [/vendors|app/],
        prefetch: [/chunk/],
      }),

    ],
  };
};

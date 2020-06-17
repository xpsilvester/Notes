# Webpack基本配置

## React环境基本配置

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const pkg = require('./package.json');

const ENV = process.env.NODE_ENV || 'development'; //在package.json中配置 开发环境和生产环境
const ASSET_PATH = process.env.ASSET_PATH || '/';
const VERSION = `v${pkg.version}`;
const IS_PROD = ENV === 'production';

const SOURCE_DIR = path.resolve(__dirname, 'src'); //把一个路径或路径片段的序列解析为一个绝对路径。相当于执行cd操作。
const OUTPUT_DIR = path.resolve(__dirname, 'build'); 
const CLIENT_DIR = path.join(OUTPUT_DIR, VERSION); //作用：将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。

module.exports = {
  mode: ENV,  //会将 process.env.NODE_ENV 的值设为 ENV 的值
  target: 'web', //<=== 默认是 'web'，可省略 构建目标：（web/node）可以分开配置、require/es6加载方式
  context: SOURCE_DIR,  //context 是webpack entry的上下文，是入口文件所处的目录的绝对路径。默认情况下，是当前项目根目录。此处设置为src目录
  entry: {
    client: './index.js',
  },
  output: {
    path: CLIENT_DIR,  //文件打包输出目录
    publicPath: ASSET_PATH, //需要把构建出的资源文件上传到 CDN 服务上，以利于加快页面的打开速度，默认值是空字符串 ''，即使用相对路径。
    filename: 'assets/[name].[hash:8].js', //输出文件名
    libraryTarget: 'umd', //配置以何种方式导出库 UMD 叫做通用模块定义规范（Universal Module Definition）
  },
  //代码优化
  optimization: {
    splitChunks: { //代码分割
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [{ //解析jsx和js
      test: /\.(jsx|js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: IS_PROD ? [  //开发环境用style-loader 内联样式，结合 webpack-dev-server 的热更新（hot reload）功能 ，生产环境用css-loader单独出一份css文件可以利用缓存，还可以加快打包速度
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({ browsers: 'last 5 versions' })],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              SOURCE_DIR,
            ],
          },
        },
      ] : [
        {
          loader: 'style-loader',
          options: { singleton: true },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({ browsers: 'last 5 versions' })],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              SOURCE_DIR,
            ],
          },
        },
      ],
    }, { //解析css文件
      test: /\.css$/,
      include: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({ browsers: 'last 5 versions' })],
            sourceMap: true,
          },
        },
      ],
    }, {
      test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
      use: IS_PROD ? {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/images/',
        },
      } : {
        loader: 'url-loader',
      },
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/style.[hash:8].css',
      chunkFilename: 'assets/css/[id].[hash:8].css',
    }),
    new CopyWebpackPlugin([
      { from: 'favicon.ico' },
    ]),
    new HtmlWebpackPlugin({
      title: 'React App',
      filename: './index.html',
      template: './index.ejs',
    }),
  ],
  devtool: IS_PROD ? 'source-map' : 'eval-source-map', //开发环境使用source-map
  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    publicPath: '/',
    contentBase: SOURCE_DIR,
    historyApiFallback: true,
  },
};
```


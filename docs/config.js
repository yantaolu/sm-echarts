const path = require('path');
const json5 = require('json5');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * 获取css loaders
 * @param prod
 */
const getCssLoaders = (prod = false) => {
  const cssLoaders = [
    prod ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    // 'postcss-loader',
  ];
  return [
    // scss
    {
      test: /\.scss$/,
      use: [
        ...cssLoaders,
        'sass-loader',
      ],
    },
    // less
    {
      test: /\.less$/,
      use: [
        ...cssLoaders,
        {
          loader: 'less-loader',
          options: {
            // strictMath: true,
            javascriptEnabled: true,
          },
        },
      ],
    },
    // css
    {
      test: /\.css$/i,
      use: [
        ...cssLoaders,
      ],
    },
  ];
};

module.exports = {
  getCssLoaders,
  config: {
    mode: 'development',
    devtool: false,
    target: 'web',
    module: {
      rules: [
        // 解析tsx/jsx
        {
          test: /\.[jt]sx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../docs'),
          ],
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/env', {
                'useBuiltIns': 'usage',
                'corejs': '3',
              }],
              '@babel/react',
              '@babel/typescript',
            ],
            plugins: [
              '@babel/proposal-class-properties',
            ],
          },
        },
        // 解析iconfont symbol引用
        {
          test: /\.svg$/i,
          include: path.resolve(__dirname, '../src/assets'),
          loader: 'svg-sprite-loader',
        },
        // 解析 images 图像
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          exclude: path.resolve(__dirname, '../src/assets'),
          type: 'javascript/auto',
        },
        // 加载字体
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'javascript/auto',
        },
        // 支持注释的json
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    optimization: {
      usedExports: false,
      minimize: false,
      // 默认压缩后IE8有问题，需手动控制配置
      minimizer: [
        new TerserPlugin({
          // 不压缩 node_modules 模块
          // exclude: /node_modules/,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
    },
  },
};

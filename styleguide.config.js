const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  config: webpackConfig,
  getCssLoaders,
} = require('./docs/config');

const {
  name: pkg,
  version,
} = require('./package.json');

module.exports = {
  title: pkg,
  version: `v${version}`,
  moduleAliases: {
    [pkg]: path.resolve(__dirname, 'src/index.tsx'),
  },
  // getComponentPathLine: (componentPath) => {
  //   const dirName = path.basename(path.dirname(componentPath));
  //   return `import { ${dirName} } from '${pkg}';`;
  // },
  // components: 'src/components/**/index.tsx',
  // ignore: [
  //   'src/components/index.tsx',
  // ],
  // pagePerSection: true,
  sections: [
    {
      name: '介绍',
      content: 'README.md',
    },
  ],
  require: [
    path.resolve(__dirname, './docs/static/react.min.js'),
    path.resolve(__dirname, './docs/static/react-dom.min.js'),
    path.resolve(__dirname, './docs/styleguide/styles.less'),
    path.resolve(__dirname, './src/index.less'),
    // path.resolve(__dirname, './dist/index.css'),
  ],
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
  ).parse,
  webpackConfig,
  dangerouslyUpdateWebpackConfig: (webpackConfig, env) => {
    const outputPath = path.resolve(__dirname, './build');

    webpackConfig.module.rules.push(...getCssLoaders(env === 'production'));

    webpackConfig.externals = {
      ...webpackConfig.externals,
      react: 'React',
      'react-dom': 'ReactDOM',
    };

    Object.assign(webpackConfig.output, {
      path: outputPath,
      filename: 'assets/[name].[hash].js',
      chunkFilename: 'assets/[name].[hash].js',
      publicPath: './',
    });

    if (env === 'production') {
      webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'assets/[name].[hash].css',
        }),
      );
      webpackConfig.optimization.minimize = true;
      webpackConfig.mode = 'production';
    } else {
      Object.assign(webpackConfig.devServer, {
        contentBase: outputPath,
      });
      webpackConfig.devtool = 'eval-source-map';
    }

    return webpackConfig;
  },
  serverPort: 9999,
  sortProps: (props) => {
    // 排除 style className 标配
    const names = props.map(({ name }) => name)
      .filter(n => !['style', 'className'].includes(n))
      .sort();
    // 按照必须、普通属性、回调函数排序
    const requires = [];
    const properties = [];
    const functions = [];
    names.forEach(n => {
      const prop = props.find(({ name }) => name === n);
      if (prop?.required) {
        requires.push(prop);
      } else if (prop?.type?.name?.includes('=>')) {
        functions.push(prop);
      } else if (prop) {
        properties.push(prop);
      }
    });
    return [...requires, ...properties, ...functions];
  },
  styleguideComponents: {
    Wrapper: path.resolve(__dirname, './docs/styleguide/components/Wrapper.jsx'),
    CodeTabButton: path.resolve(__dirname, './docs/styleguide/components/CodeTabButton.jsx'),
  },
};

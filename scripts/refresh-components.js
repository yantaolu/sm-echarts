const path = require('path');
const fs = require('fs');
const download = require('download');

const { logInfo, logError } = require('./utils');

const camelCase = (name = '') => name.replace(/[A-Z]/g, ($1) => `-${$1}`.toLowerCase())
  .replace(/^\-/, '');

// resolve 组件目录
const resolveComponent = (...names) => path.join(__dirname, '../src/components', ...names);

/**
 * 构建入口文件
 */
const generateIndex = () => {
  const lines = [];

  // 组件
  const components = [];
  const componentNames = [];
  // 读取组件目录
  fs.readdirSync(resolveComponent(), { withFileTypes: true }).forEach((dirent) => {
    const { name } = path.parse(dirent.name);
    if (!name.startsWith('.') && (dirent.isDirectory() || (dirent.isFile() && ![
      'index',
      'types',
      'util',
      'common',
    ].includes(name)))) {
      components.push(`export { default as ${name} } from './${name}';`);
      componentNames.push(name);
    }
  });
  // 写组件入口文件
  fs.writeFileSync(path.resolve(__dirname, '../src/components/index.tsx'), components.join('\n'), 'utf-8');

  lines.push('// 组件');
  lines.push(`export {\n  ${componentNames.join(',\n  ')},\n} from './components';\n`);

  // 私有库版本
  lines.push(`export const version = '${require('../package.json').version}';\n`);

  lines.push('// 工具函数');
  lines.push('export { default as types } from \'./utils/type-util\';');
  lines.push('export { default as classNames } from \'classnames\';');
  fs.writeFileSync(path.resolve(__dirname, '../src/index.tsx'), lines.join('\n'), 'utf-8');

  logInfo('生成主入口文件');
};

/**
 * 构建组件样式文件
 */
const generateComponentLess = () => {
  const lesses = [];
  fs.readdirSync(resolveComponent(), { withFileTypes: true })
    .forEach((dirent) => {
      const name = dirent.name;
      if (dirent.isDirectory() && fs.existsSync(resolveComponent(name, 'index.less'))) {
        lesses.push(`@import './${name}/index.less';`);
      }
    });
  fs.writeFileSync(resolveComponent('index.less'), [...lesses, ''].join('\n'), 'utf-8');

  logInfo('生成组件样式主文件');
};

const downloadIcon = async () => {
  try {
    fs.writeFileSync(path.resolve(__dirname, '../src/assets/icon-font.js'), await download(require('../package.json')['icon-font'].replace(/^hhtps?:/, '').replace(/^\/\//, '')));
    logInfo('下载字体图标文件');
  } catch (e) {
    logError(`字体图标文件下载失败, ${e.message}`);
    process.exit(1);
  }
};

(async () => {
  // await downloadIcon();
  generateComponentLess();
  generateIndex();
})();

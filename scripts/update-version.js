const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const { logInfo, logError } = require('./utils');

const getNextVersion = () => inquirer.prompt({
  type: 'list',
  name: 'version',
  message: '请选择更新版本模式',
  choices: [{
    value: '',
    name: '不更新版本'
  }, {
    value: 'alpha',
    name: '测试版'
  }, {
    value: 'patch',
    name: '小版本',
  }, {
    value: 'minor',
    name: '次版本',
  }, {
    value: 'major',
    name: '主版本',
  }],
}).then(({ version }) => {
  // 当前版本
  const v = pkg.version;
  if (!version) {
    return v;
  }
  const [major, minor, patch] = v.split('.');
  const [p, alpha] = patch.split('-');
  // 主版本+1
  if (version === 'major') return [Number(major) + 1, 0, 0].join('.');
  // 次版本+1
  if (version === 'minor') return [major, Number(minor) + 1, '0'].join('.');
  // 小版本+1
  if (version === 'patch') return [major, minor, alpha ? p : Number(p) + 1].join('.');

  const a = Number(alpha && alpha.replace('alpha', '') || 0) + 1;
  // alpha版
  return [major, minor, [alpha ? p : Number(p) + 1, `alpha${a}`].join('-')].join('.');
});

(async () => {
  const version = await getNextVersion();

  try {
    fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify({
      ...pkg,
      version
    }, null, 2), 'utf-8');

    logInfo(`当前版本 -> ${version}`);
  } catch (e) {
    logError(e.message);
  }
})();

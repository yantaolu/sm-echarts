const log = console.log;

const getTimeString = () => {
  const now = new Date();
  return [
    // 日期
    [now.getMonth() + 1, now.getDate()].map(t => `${t}`.padStart(2, '0')).join('-'),
    // 时间
    [now.getHours(), now.getMinutes(), now.getSeconds()].map(t => `${t}`.padStart(2, '0')).join(':')
  ].join(' ');
};

const logInfo = (...logs) => {
  logs.unshift(getTimeString());
  log('\x1B[32m%s\x1B[39m', logs.join(' '));
};

const logError = (...logs) => {
  logs.unshift(getTimeString());
  log('\x1B[31m%s\x1B[39m', logs.join(' '));
};

module.exports = {
  logInfo,
  logError
};

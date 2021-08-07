const os = Object.prototype.toString;

const isType = (arg: any, type: string) => os.call(arg).slice(8, -1).toLowerCase() === type;

export default class TypeUtil {
  constructor() {
    throw new Error('静态工具类禁止实例化');
  }

  static isArray = (arg: any) => Array.isArray(arg);

  static isPlainObject = (arg: any) => isType(arg, 'object');

  static isString = (arg: any) => typeof arg === 'string';
}

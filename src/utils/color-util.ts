import { ZRColor } from 'echarts/types/dist/shared';

type ColorStop = string | {
  offset: number;
  color: string;
};

class ColorUtil {
  constructor() {
    throw new Error('静态工具类禁止实例化');
  }

  /**
   * 线性渐变颜色，横向渐变 [0, 0] -> [1, 0], 纵向渐变 [0, 0] -> [0, 1]
   * @param colors
   * @param start [0, 0]
   * @param end [1, 0]
   */
  static generateLinearColor(colors: ColorStop[], start: [number, number] = [0, 0], end: [number, number] = [1, 0]): ZRColor {
    const [x, y] = start;
    const [x2, y2] = end;
    const step = 1 / (colors.length - 1);

    const colorStops = colors.map((color, index) => {
      if (typeof color === 'string') {
        return {
          offset: Math.min(Math.round(step * index * 100) / 100, 1),
          color,
        };
      }
      return color;
    });

    return {
      type: 'linear',
      x,
      y,
      x2,
      y2,
      colorStops,
      global: false,
    };
  }

  /**
   * 径向渐变颜色，从圆心 [0.5, 0.5] 按照半径 0.5 来渐变
   * @param colors
   * @param r 半径 0.5
   * @param center 圆心 [0.5, 0.5]
   */
  static generateRadialColor(colors: ColorStop[], r = 0.5, center: [number, number] = [0.5, 0.5]): ZRColor {
    const [x, y] = center;
    const step = 1 / (colors.length - 1);

    const colorStops = colors.map((color, index) => {
      if (typeof color === 'string') {
        return {
          offset: Math.min(Math.round(step * index * 100) / 100, 1),
          color,
        };
      }
      return color;
    });

    return {
      type: 'radial',
      x,
      y,
      r,
      colorStops,
      global: false,
    };
  }

  /**
   * 纹理填充的颜色
   * @param image
   * @param repeat
   */
  static generateImageColor(image: HTMLImageElement | HTMLCanvasElement, repeat?: boolean | 'x' | 'y'): ZRColor {
    return {
      image,
      repeat: repeat === true ? 'repeat' : repeat === 'x' ? 'repeat-x' : repeat === 'y' ? 'repeat-y' : 'no-repeat',
    };
  }

  /**
   * 16进制色值转为rgb色值
   * @param color 16进制色值
   */
  static transRgb2Hex(color: string): string {
    const rgbArr = color.match(/[\d.]+/g)?.map(Number);
    if (rgbArr.length === 3) {
      return `#${rgbArr.map(num => num.toString(16).padStart(2, '0')).join('')}`;
    }
    return color;
  }

  /**
   * rgb色值转为16进制色值
   * @param color rgb色值
   */
  static transHex2Rgb(color: string): string {
    if (!color.includes('#')) return color;
    let colorString = color.trim().replace('#', '');
    if (colorString.length === 3) {
      colorString = colorString.split('').map(s => s.repeat(2)).join('');
    }
    const colorArr = colorString.toLowerCase().match(/[a-z0-9]{2}/g);
    return `rgb(${colorArr.map(c => parseInt('0x' + c)).join(', ')})`;
  }

  /**
   * 根据背景色转换rgba色值
   * @param color rgba色值
   * @param bkg 背景色值（色值不能有rgba）
   */
  static transRgba2Rgb(color: string, bkg: string): string {
    if (!color.includes('rgba')) return color;

    if (!bkg.includes('rgba')) {
      const rgbaArr = color.match(/[\d.]+/g)?.map(Number);
      if (rgbaArr?.length === 4 && !bkg.includes('rgba')) {
        const [, , , alpha] = rgbaArr;
        const rgb = ColorUtil.transHex2Rgb(bkg)
          .match(/[\d.]+/g)?.map(Number)
          //Color = Color * alpha + bkg * (1 - alpha);
          .map((b, index) => rgbaArr[index] * alpha + b * (1 - alpha))
          .join(', ');

        return `rgb(${rgb})`;
      }
    }

    return color;
  }
}

export default ColorUtil;

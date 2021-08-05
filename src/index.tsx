import React from 'react';
import * as echarts from 'echarts';
import { EChartsOption, EChartsType, GeoOption, GridOption, LegendComponentOption, SeriesOption, TooltipOption, XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import classNames from 'classnames';
import { EventUtil } from './utils';
import './index.less';

export { default as ColorUtil } from './utils/color-util';

// lodash 递归合并
const merge = require('lodash/object/merge');
// lodash 深拷贝
const deepClone = require('lodash/lang/cloneDeep');
// lodash 节流
const throttle = require('lodash/function/throttle');
// lodash 防抖
const debounce = require('lodash/function/debounce');

// 图表类型
type ChartType = SeriesOption['type'];

// 将 EChartsOption 部分配置层级提升
type SmEChartsOption = {
  /**
   * @deprecated
   */
  legend?: LegendComponentOption | LegendComponentOption[];
  /**
   * @deprecated
   */
  grid?: GridOption | GridOption[];
  /**
   * @deprecated
   */
  xAxis?: XAXisOption | XAXisOption[];
  /**
   * @deprecated
   */
  yAxis?: YAXisOption | YAXisOption[];
  /**
   * @deprecated
   */
  geo?: GeoOption | GeoOption[];
  /**
   * @deprecated
   */
  series?: SeriesOption | SeriesOption[];
  /**
   * @deprecated
   */
  tooltip?: TooltipOption | TooltipOption[];
} & Omit<EChartsOption, 'legend' | 'grid' | 'xAxis' | 'yAxis' | 'geo' | 'series' | 'tooltip'>;

type SmEChartsProps = {
  className?: string;
  style?: React.CSSProperties;
  // echarts setOption
  notMerge?: boolean;
  lazyUpdate?: boolean;
  // echarts option
  option?: SmEChartsOption;
  legend?: LegendComponentOption | LegendComponentOption[];
  grid?: GridOption | GridOption[];
  xAxis?: XAXisOption | XAXisOption[];
  yAxis?: YAXisOption | YAXisOption[];
  geo?: GeoOption | GeoOption[];
  series?: SeriesOption | SeriesOption[];
  tooltip?: TooltipOption | TooltipOption[];
  // custom option
  type?: ChartType | ChartType[];
  category?: any[];
  data?: any[];
  multi?: boolean;
  rotateAxis?: boolean;
  debug?: boolean;
};

const ResizeEvent = 'resize.chart';

export default class SmECharts extends React.Component<SmEChartsProps, any> {
  /**
   * 可以替换 echarts 版本
   */
  static echarts = echarts;
  /**
   * 默认配置项
   */
  static defaultProps = {
    type: 'line',
    notMerge: false,
    lazyUpdate: false,
  };

  static defaultOption = {};

  static defaultAxis = {
    // 坐标系
    grid: {
      show: true,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    // x轴
    xAxis: {
      show: true,
      type: 'category',
    },
    // y轴
    yAxis: {
      show: true,
      type: 'value',
    },
  };

  private $root: HTMLDivElement;
  private chartInstance: EChartsType;

  constructor(props: SmEChartsProps) {
    super(props);
  }

  /**
   * 将 option 中特定项转成数组
   * @param option
   */
  transOptionItem2Array(option: EChartsOption): EChartsOption {
    const newOption = deepClone(option);

    ['legend', 'grid', 'xAxis', 'yAxis', 'geo', 'series', 'tooltip'].forEach((key: string) => {
      if (newOption?.[key] && !Array.isArray(newOption[key])) {
        newOption[key] = [newOption[key]];
      }
    });

    return newOption;
  }

  getMergedSeries(): SeriesOption[] {
    const { option = {}, series, multi, data, type } = this.props;
    const dataArr = Array.isArray(type) || multi ? data : [data];
    let types = Array.isArray(type) ? type : [type];

    if (multi && types.length === 1 && dataArr.length > 1) {
      types = Array.from({ length: dataArr.length }).map(() => types[0]);
    }

    // @ts-ignore
    let mergedSeries: SeriesOption[] = types.map((type, i) => ({
      type,
      data: dataArr[i] || [],
    }));

    [option?.series, series].filter(Boolean).forEach((series) => {
      if (Array.isArray(series)) {
        mergedSeries = merge([], mergedSeries, series);
      } else if (typeof series === 'object') {
        // @ts-ignore
        mergedSeries = mergedSeries.map((item) => ({ ...item, ...series }));
      }
    });

    return mergedSeries;
  }

  getMergedOption(): EChartsOption {
    const { option = {}, type, grid, legend, geo, xAxis, yAxis, rotateAxis, tooltip, category } = this.props;

    const { series: _, ...others } = option;

    const mergedSeries = this.getMergedSeries();

    const types = Array.isArray(type) ? type : [type];

    let defaultOption = deepClone(SmECharts.defaultOption);

    // 需要坐标轴的图表
    // line,bar,scatter,effectScatter,pictorialBar(象形图),
    // boxplot(箱形图),candlestick(k线图),heatmap(热力图),custom
    if (types.some(type => [
      'line', 'bar', 'scatter', 'effectScatter', 'pictorialBar',
      'boxplot', 'candlestick', 'heatmap', 'custom',
    ].includes(type))) {
      const { xAxis = {}, yAxis = {}, ...defaultAxis } = SmECharts.defaultAxis;
      const { xAxis: x = {}, yAxis: y = {}, ...option } = defaultOption;

      const [xa, ya] = rotateAxis ? ['yAxis', 'xAxis'] : ['xAxis', 'yAxis'];

      // 合并坐标轴相关默认配置
      defaultOption = merge({}, ...[{
        [xa]: xAxis,
        [ya]: yAxis,
      }, {
        [xa]: x,
        [ya]: y,
      }, defaultAxis, option, Array.isArray(category) && {
        [xa]: { data: category },
      }].filter(Boolean));
    }

    return merge({}, ...[
      defaultOption,
      others,
      {
        legend, grid, xAxis, yAxis, geo, tooltip,
      },
      { series: mergedSeries },
    ].map(this.transOptionItem2Array));
  }

  setChartOption = debounce(() => {
    const { notMerge, lazyUpdate, debug } = this.props;
    const option = this.getMergedOption();
    debug && console.info('setOption', option);
    this.chartInstance?.setOption(option, notMerge, lazyUpdate);
  }, 100);

  handleWindowResize = throttle(() => {
    this.chartInstance?.clear();
    this.chartInstance?.resize();
    this.setChartOption();
  }, 67);

  componentDidMount() {
    // @ts-ignore
    this.chartInstance = echarts.init(this.$root);
    this.setChartOption();
    // 监听resize
    EventUtil.addEventListener(ResizeEvent, this.handleWindowResize);
  }

  componentDidUpdate() {
    this.setChartOption();
  }

  componentWillUnmount() {
    // 移除监听resize
    EventUtil.removeEventListener(ResizeEvent, this.handleWindowResize);
    // 销毁
    this.chartInstance?.dispose();
  }

  render() {
    const { className, style } = this.props;
    return <div ref={el => this.$root = el} className={classNames('sm-echarts', className)} style={style} />;
  }
}

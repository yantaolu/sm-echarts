import React from 'react';
import * as echarts from 'echarts';
import { EChartsOption, EChartsType, SeriesOption } from 'echarts/types/dist/shared';
import { EventUtil } from './utils';
import './index.less';
import TypeUtil from './utils/type-util';
import { EventHandler, SmEChartsProps } from './types';

export { default as ColorUtil } from './utils/color-util';

// lodash 递归合并
const merge = require('lodash/object/merge');
// lodash 深拷贝
const deepClone = require('lodash/lang/cloneDeep');
// lodash 节流
const throttle = require('lodash/function/throttle');
// lodash 防抖
const debounce = require('lodash/function/debounce');

const classNames = (...names: string[]) => names.filter(Boolean).join(' ');

const ResizeEvent = 'resize.chart';

export default class SmECharts extends React.Component<SmEChartsProps, any> {
  /**
   * 可以替换 echarts 版本
   */
  public static echarts = echarts;
  /**
   * 默认配置项
   */
  public static defaultProps = {
    type: 'line',
    notMerge: false,
    lazyUpdate: false,
  };

  public static defaultOption = {};

  public static defaultAxis = {
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
  public echartsInstance: EChartsType;

  constructor(props: SmEChartsProps) {
    super(props);
    this.state = { data: [] };
  }

  /**
   * 将 option 中特定项转成数组
   * @param option
   */
  private transOptionItem2Array(option: EChartsOption): EChartsOption {
    const newOption = deepClone(option);

    ['legend', 'grid', 'xAxis', 'yAxis', 'geo', 'series', 'tooltip'].forEach((key: string) => {
      if (newOption?.[key] && !Array.isArray(newOption[key])) {
        newOption[key] = [newOption[key]];
      }
    });

    return newOption;
  }

  private getMergedSeries(): SeriesOption[] {
    const { option = {}, series, multi, type } = this.props;
    const data = this.props.data ?? this.state.data;
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

  private getMergedOption(): EChartsOption {
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

  private setChartOption = debounce(() => {
    const { notMerge, lazyUpdate, debug, beforeSetOption, afterSetOption } = this.props;
    const option = this.getMergedOption();
    debug && console.info('setOption', option);
    beforeSetOption?.(this);
    this.echartsInstance?.setOption(option, notMerge, lazyUpdate);
    afterSetOption?.(this);
  }, 100);

  private handleWindowResize = throttle(() => {
    this.echartsInstance?.clear();
    this.echartsInstance?.resize();
    this.setChartOption();
  }, 67);

  // 解绑所有事件
  private unbindEvents = (props: SmEChartsProps) => {
    Object.keys(props.onEvents || {}).forEach(eventName => this.echartsInstance?.off(eventName));
  };

  // 绑定事件
  private bindEvens = () => {
    const events = this.props.onEvents || {};
    const isDebug = this.props.debug;

    const bindEvent = (eventName: string, handler: EventHandler) => {
      if (typeof handler === 'function') {
        isDebug && console.info('绑定事件', eventName);
        this.echartsInstance?.on(eventName, handler);
      } else if (Array.isArray(handler) && handler.length === 2) {
        const [query, eventHandler] = handler;
        isDebug && console.info('绑定事件', eventName, query);
        this.echartsInstance?.on(eventName, query, eventHandler);
      }
    };

    Object.keys(events).forEach(eventName => {
      const handler = events[eventName];
      if (Array.isArray(handler)) {
        if (handler.length === 2
          && handler.every(item => !Array.isArray(item))
          && (TypeUtil.isPlainObject(handler[0]) || TypeUtil.isString(handler[0]))
          && typeof handler[1] === 'function') {
          // @ts-ignore
          bindEvent(eventName, handler);
        } else {
          handler.forEach((eventHandler: EventHandler) => bindEvent(eventName, eventHandler));
        }
      } else if (typeof handler === 'function') {
        bindEvent(eventName, handler);
      }
    });
  };

  private async fetchData() {
    if (this.props.fetchData) {
      try {
        const data = await this.props.fetchData();
        this.setState({ data: data || [] });
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  componentDidMount() {
    // @ts-ignore
    this.echartsInstance = SmECharts.echarts.init(this.$root);
    this.props?.onInit?.(this);
    this.setChartOption();
    this.bindEvens();
    // 监听resize
    EventUtil.addEventListener(ResizeEvent, this.handleWindowResize);
    this.fetchData();
  }

  componentDidUpdate(prevProps: SmEChartsProps) {
    this.setChartOption();
    this.unbindEvents(prevProps);
    this.bindEvens();
  }

  componentWillUnmount() {
    // 移除监听resize
    EventUtil.removeEventListener(ResizeEvent, this.handleWindowResize);
    this.unbindEvents(this.props);
    this.props.onDestroy?.(this);
    // 销毁
    this.echartsInstance?.dispose();
  }

  render() {
    const { className, style, ...others } = this.props;

    // 外部传入的 dom events
    const domEvents: Record<any, any> = {};
    Object.keys(others).forEach(key => {
      // @ts-ignore
      /^on[CDM][lor]/.test(key) && (domEvents[key] = others[key]);
    });

    return <div
      ref={el => this.$root = el} style={style}
      className={classNames('sm-echarts', className)}
      {...domEvents}
    />;
  }
}

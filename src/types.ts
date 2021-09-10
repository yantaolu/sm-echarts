import React, { DragEventHandler, MouseEventHandler } from 'react';
import { EChartsOption, GeoOption, GridOption, LegendComponentOption, SeriesOption, TooltipOption, XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import SmECharts from './index';

// MouseEvents
export type MouseEvents<T extends HTMLElement> = {
  onClick?: MouseEventHandler<T>;
  onClickCapture?: MouseEventHandler<T>;
  onContextMenu?: MouseEventHandler<T>;
  onContextMenuCapture?: MouseEventHandler<T>;
  onDoubleClick?: MouseEventHandler<T>;
  onDoubleClickCapture?: MouseEventHandler<T>;
  onDrag?: DragEventHandler<T>;
  onDragCapture?: DragEventHandler<T>;
  onDragEnd?: DragEventHandler<T>;
  onDragEndCapture?: DragEventHandler<T>;
  onDragEnter?: DragEventHandler<T>;
  onDragEnterCapture?: DragEventHandler<T>;
  onDragExit?: DragEventHandler<T>;
  onDragExitCapture?: DragEventHandler<T>;
  onDragLeave?: DragEventHandler<T>;
  onDragLeaveCapture?: DragEventHandler<T>;
  onDragOver?: DragEventHandler<T>;
  onDragOverCapture?: DragEventHandler<T>;
  onDragStart?: DragEventHandler<T>;
  onDragStartCapture?: DragEventHandler<T>;
  onDrop?: DragEventHandler<T>;
  onDropCapture?: DragEventHandler<T>;
  onMouseDown?: MouseEventHandler<T>;
  onMouseDownCapture?: MouseEventHandler<T>;
  onMouseEnter?: MouseEventHandler<T>;
  onMouseLeave?: MouseEventHandler<T>;
  onMouseMove?: MouseEventHandler<T>;
  onMouseMoveCapture?: MouseEventHandler<T>;
  onMouseOut?: MouseEventHandler<T>;
  onMouseOutCapture?: MouseEventHandler<T>;
  onMouseOver?: MouseEventHandler<T>;
  onMouseOverCapture?: MouseEventHandler<T>;
  onMouseUp?: MouseEventHandler<T>;
  onMouseUpCapture?: MouseEventHandler<T>;
}

// 图表类型
export type ChartType = SeriesOption['type'];

// 将 EChartsOption 部分配置层级提升
export type SmEChartsOption = {
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

export type EventHandler = ((arg: any) => void) | [string | Record<string, any>, (arg: any) => void];

export type SmEChartsProps = {
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
  // category 坐标轴数据
  category?: any[];
  // series 数据
  data?: any[];
  // 是否多组 series
  multi?: boolean;
  // 旋转坐标轴
  rotateAxis?: boolean;
  // 控制台输出 option
  debug?: boolean;
  // echarts 事件绑定
  onEvents?: Record<string, EventHandler | EventHandler[]>;
  // 初始化钩子
  onInit?: (instance: SmECharts) => void;
  // 设置 option 之前钩子
  beforeSetOption?: (instance: SmECharts) => void;
  // 设置 option 之后钩子
  afterSetOption?: (instance: SmECharts) => void;
  // 销毁钩子
  onDestroy?: (instance: SmECharts) => void;
  // 获取数据
  fetchData?: () => (any[] | Promise<any[]>);
} & MouseEvents<HTMLDivElement>;

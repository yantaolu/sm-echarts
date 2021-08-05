#### 使用

```shell
# 使用npm安装
npm install sm-echarts -S

# 使用yarn安装
yarn add sm-echarts -S
```

#### 使用优势

1. 使用 `TypeScript` 封装，编辑器智能提醒，再也不用刷 <a href="https://echarts.apache.org/zh/option.html#title" target="_blank">echarts</a> 文档了
2. 开发使用 `React 0.14` 构建 class 组件，可保证各种 React 版本的兼容
3. 外置 `echarts` 支持 echarts 4.x/5.x 的各种版本，可以保障浏览器的兼容性
4. 将 `option` 中常用属性提到 props 中，不需要一层一层的嵌套配置，使用更加简单，同时内置智能合并逻辑，可以将 option 中的配置和 props 的配置进行合并，props 中的优先级更高
5. 内置 `resize` 监听逻辑，自动重绘

#### SmECharts Props

<div class="serv-api-table">

|Prop name|Type|Default|Description|
|:---|:---|:---|:---|
|className|string||外置样式类名|
|style|React.CSSProperties||外置内联样式|
|notMerge|boolean|false|chart.setOption(option, notMerge, lazyUpdate); 设置属性时是否不跟之前设置的 option 进行合并|
|lazyUpdate|boolean|false|chart.setOption(option, notMerge, lazyUpdate); 设置属性时是否不立即更新图表|
|option|Omit<EChartsOption, 'legend'｜'grid'｜'xAxis'｜'yAxis'｜'geo'｜'series'｜'tooltip'>||echarts 建议除了 'legend'｜'grid'｜'xAxis'｜'yAxis'｜'geo'｜'series'｜'tooltip' 以外其他的配置项|
|legend|LegendComponentOption｜LegendComponentOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#legend" >echarts legend 配置项</a>|
|grid|GridOption｜GridOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#grid" >echarts grid 配置项</a>|
|xAxis|XAXisOption｜XAXisOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#xAxis" >echarts xAxis 配置项</a>|
|yAxis|YAXisOption｜YAXisOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#yAxis" >echarts yAxis 配置项</a>|
|geo|GeoOption｜GeoOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#geo" >echarts geo 配置项</a>|
|series|SeriesOption｜SeriesOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#series" >echarts series 配置项</a>|
|tooltip|TooltipOption｜TooltipOption[]||<a target="_blank" href="https://echarts.apache.org/zh/option.html#tooltip" >echarts tooltip 配置项</a>|
|type|SeriesOption['type']｜SeriesOption['type'][]|line|series 中的 type 属性|
|data|SeriesOption['data']｜SeriesOption['data'][]||series 中的 data 属性|
|category|XAXisOption['data']||xAxis 中的 data 属性，当 rotateAxis 为 true 时，则会设置到 yAxis 中|
|multi|boolean|false|同一类型多组数据渲染，data 接收二维数组合并后有多组 series|
|rotateAxis|boolean|false|旋转坐标轴，默认 xAxis 及 yAxis 的属性互换|
|debug|boolean|false|控制台输出合并后的 option 方便调试|

</div>

#### 基本使用

```jsx
import SmECharts from 'sm-echarts';

<div className={'chart-container'}>
  <div className='chart-wrapper'>
    <SmECharts type={'line'} category={[1, 2, 3, 4, 5]} data={[7, 9, 5, 3, 10]} />
  </div>
  <div className='chart-wrapper'>
    <SmECharts type={'bar'} category={[1, 2, 3, 4, 5]} data={[7, 9, 5, 3, 10]} />
  </div>
  <div className='chart-wrapper'>
    <SmECharts type={'pie'} data={[7, 9, 5, 3, 10]} />
  </div>
  <div className='chart-wrapper'>
    <SmECharts type={'gauge'} data={[7, 9, 5, 3, 10]} />
  </div>
</div>
```

#### 多组数据 - multi

```jsx
import SmECharts from 'sm-echarts';

<div className={'chart-container'}>
  <div className='chart-wrapper'>
    <SmECharts type={'line'} category={[1, 2, 3, 4, 5]} data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} multi />
  </div>
  <div className='chart-wrapper'>
    <SmECharts type={'bar'} category={[1, 2, 3, 4, 5]} data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} multi />
  </div>
</div>
```

#### 旋转坐标轴 - rotateAxis

```jsx
import SmECharts from 'sm-echarts';

<div className={'chart-container'}>
  <div className='chart-wrapper'>
    <SmECharts type={'line'} category={[1, 2, 3, 4, 5]} data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} multi rotateAxis />
  </div>
  <div className='chart-wrapper'>
    <SmECharts type={'bar'} category={[1, 2, 3, 4, 5]} data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} multi rotateAxis />
  </div>
</div>
```

#### 自由组合

```jsx
import SmECharts, { ColorUtil } from 'sm-echarts';

<div className={'chart-container'}>
  <div className='chart-wrapper'>
    <SmECharts
      type={['line', 'bar']} category={[1, 2, 3, 4, 5]}
      series={[{
        smooth: true,
        areaStyle: { color: ColorUtil.generateLinearColor(['#f5bd27', 'green']) }
      }, {
        itemStyle: { color: '#f5bd27' }
      }
      ]}
      data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} />
  </div>
  <div className='chart-wrapper'>
    <SmECharts
      type={['line', 'bar']} category={[1, 2, 3, 4, 5]}
      data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} rotateAxis />
  </div>
  <div className='chart-wrapper' style={{ width: '100%' }}>
    <SmECharts type={['pie', 'pie']} series={[{ center: ['30%', '50%'] }, { center: ['70%', '50%'] }]} data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} />
  </div>
</div>
```

#### 数据动态更新 - 尝试鼠标移入/移出图表

```jsx
import { useState } from 'react';
import SmECharts from 'sm-echarts';

const [data, setData] = useState([7, 9, 5, 3, 10]);

<div
  className='chart-wrapper'
  onMouseEnter={() => setData([3, 5, 7, 6, 3])}
  onMouseLeave={() => setData([7, 9, 5, 3, 10])}
>
  <SmECharts
    type={'line'} category={[1, 2, 3, 4, 5]} data={data} />
</div>
```

#### 修改全局配置

```jsx static
import SmECharts from 'sm-echarts';

// 全局公共配置
SmECharts.defaultOption = {
  color: [
    '#5899f5', '#46dbc2', '#20b8e6',
    '#f5bd27', '#5ac846', '#f57d71',
    '#776edb', '#f59e6e', '#5980b3',
    '#ca91f2',
  ]
};

// 全局公共坐标系
SmECharts.defaultAxis = {
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
```

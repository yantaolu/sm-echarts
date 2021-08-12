#### `最新更新` - v1.0.6

1. 组件dom根节点支持绑定鼠标相关事件，props传入
2. 增加初始化、销毁、设置option前、设置option后的钩子

#### `特点`

1. 使用 `TypeScript` 封装，编辑器智能提醒，再也不用刷 <a href="https://echarts.apache.org/zh/option.html#title" target="_blank">echarts</a> 文档了
2. 开发使用 `React 0.14` 构建 class 组件，可保证各种 React 版本的兼容
3. 外置 `echarts` 支持 echarts 4.x/5.x 的各种版本，可以保障浏览器的兼容性
4. 将 `option` 中常用属性提到 props 中，不需要一层一层的嵌套配置，使用更加简单，同时内置智能合并逻辑，可以将 option 中的配置和 props 的配置进行合并，props 中的优先级更高
5. 内置 `resize` 监听逻辑，自动重绘

#### `SmECharts Props`

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
|onEvents|Record<string, EventHandler｜EventHandler[]>||`1.0.4 新增`，提供 ehcarts 实例绑定事件方式，内部会在更新/卸载时自动解绑|
|onInit|(ins: SmECharts) => void||`1.0.6 新增`，完成初始化 echarts 钩子|
|onDestroy|(ins: SmECharts) => void||`1.0.6 新增`，销毁 echarts 钩子|
|beforeSetOption|(ins: SmECharts) => void||`1.0.6 新增`，每次 echarts.setOption 前钩子|
|afterSetOption|(ins: SmECharts) => void||`1.0.6 新增`，每次 echarts.setOption 后钩子|

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
    type={'line'} category={[1, 2, 3, 4, 5]} data={data}
    onEvents={{
      click: () => {
        alert('点击了折线图')
      }
    }}
  />
</div>
```

#### echarts 事件绑定

> 关于事件类型及绑定事件方式，请参照 <a href="https://echarts.apache.org/zh/api.html#echartsInstance.on" target="_blank">echarts官方文档</a>，
> 事件绑定也可以利用 ref 获取组件内 echarts 实例属性 `echartsInstance`

```jsx
import SmECharts from 'sm-echarts';

<div className={'chart-container'}>
  <div className='chart-wrapper'>
    <SmECharts
      type={'line'}
      // ref={chart => console.log(chart.echartsInstance)}
      option={{
        title: {
          show: true,
          text: '点击折线图',
          left: 'center',
        }
      }}
      onEvents={{
        click: () => {
          alert('点击了折线图')
        }
      }}
      category={[1, 2, 3, 4, 5]}
      data={[7, 9, 5, 3, 10]} />
  </div>
  <div className='chart-wrapper'>
    <SmECharts
      type={['line', 'bar']}
      option={{
        title: {
          show: true,
          text: '分别点击折线图/柱状图',
          left: 'center',
        }
      }}
      onEvents={{
        click: [
          ['series.bar', () => {
            alert('点击了柱状图')
          }],
          ['series.line', () => {
            alert('点击了折线图')
          }]
        ]
      }}
      category={[1, 2, 3, 4, 5]}
      data={[[7, 9, 5, 3, 10], [3, 5, 7, 6, 3]]} />
  </div>
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

#### 更新日志

- `1.0.6`
  1. 组件dom根节点支持绑定鼠标相关事件，props传入
  2. 增加初始化、销毁、设置option前、设置option后的钩子

- `1.0.5`
  1. 增加 echarts 事件绑定机制

- `1.0.0`
  1. 完成React Ts版封装

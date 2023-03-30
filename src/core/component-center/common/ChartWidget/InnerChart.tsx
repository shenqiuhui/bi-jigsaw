import { memo, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { isEmpty } from 'lodash-es';
import ReactECharts from 'echarts-for-react/lib/core';
import { EChartsInstance, EChartsOption } from 'echarts-for-react/lib/types';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DatasetComponent,
  CanvasRenderer
]);

interface InnerChartProps {
  theme?: string;
  option: EChartsOption;
  height: number;
  width: number;
}

export interface CharInstanceRefType {
  charInstance: EChartsInstance;
}

const InnerChart = memo(forwardRef<CharInstanceRefType, InnerChartProps>((props, ref) => {
  const { theme = 'light', option, height, width } = props;

  const [charInstance, setCharInstance] = useState<EChartsInstance>();
  const reactEchartRef = useRef<ReactECharts>(null);

  useImperativeHandle(ref, () => ({
    charInstance,
  }));

  useEffect(() => {
    if (!isEmpty(option)) {
      const chartInstance = reactEchartRef?.current?.getEchartsInstance();
      setCharInstance(chartInstance);
    };
  }, [option, theme]);

  useEffect(() => {
    charInstance?.resize({ height, width });
  }, [charInstance, height, width]);

  return (
    <ReactECharts
      notMerge
      echarts={echarts}
      option={option}
      theme={theme}
      ref={reactEchartRef}
    />
  );
}));

export default InnerChart;

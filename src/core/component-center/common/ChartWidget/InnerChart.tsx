import { memo, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import ReactECharts, { EChartsInstance, EChartsOption } from 'echarts-for-react';
import { isEmpty } from 'lodash';

interface InnerChartProps {
  option: EChartsOption;
  height: number;
  width: number;
}

export interface CharInstanceRefType {
  charInstance: EChartsInstance;
}

const InnerChart = memo(forwardRef<CharInstanceRefType, InnerChartProps>((props, ref) => {
  const { option, height, width } = props;

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
  }, [option]);

  useEffect(() => {
    charInstance?.resize({ height, width });
  }, [charInstance, height, width]);

  return (
    <ReactECharts
      notMerge
      option={option}
      theme="dark"
      ref={reactEchartRef}
    />
  );
}));

export default InnerChart;

import { memo, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import ReactECharts, { EChartsInstance, EChartsOption } from 'echarts-for-react';
import { isEmpty } from 'lodash';

interface IInnerChartProps {
  option: EChartsOption;
  height: number;
  width: number;
}

export interface ICharInstanceRef {
  charInstance: EChartsInstance
}

const InnerChart = memo(forwardRef<ICharInstanceRef, IInnerChartProps>((props, ref) => {
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
      ref={reactEchartRef}
    />
  );
}));

export default InnerChart;

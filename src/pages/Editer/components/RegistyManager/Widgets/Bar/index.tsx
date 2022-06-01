import { memo, forwardRef } from 'react';
import ChartWidget from '../../Common/ChartWidget';
import { IBarWidgetProps, IWidgetRef } from '../../../../types';

const BarWidget = memo(forwardRef<IWidgetRef, IBarWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/getBarData" />
  );
}));

export default BarWidget;

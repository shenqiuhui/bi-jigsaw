import { memo, forwardRef } from 'react';
import { IBarWidgetProps, IWidgetRef } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const BarWidget = memo(forwardRef<IWidgetRef, IBarWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/bar" />
  );
}));

export default BarWidget;

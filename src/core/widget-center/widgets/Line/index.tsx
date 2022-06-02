import { memo, forwardRef } from 'react';
import { ILineWidgetProps, IWidgetRef } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const LineWidget = memo(forwardRef<IWidgetRef, ILineWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/line" />
  );
}));

export default LineWidget;

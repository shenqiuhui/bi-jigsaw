import { memo, forwardRef } from 'react';
import { IPieWidgetProps, IWidgetRef } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const PieWidget = memo(forwardRef<IWidgetRef, IPieWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/pie" />
  );
}));

export default PieWidget;

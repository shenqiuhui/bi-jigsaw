import { memo } from 'react';
import { IBarWidgetProps } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const BarWidget: React.FC<IBarWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/bar" />
  );
});

export default BarWidget;

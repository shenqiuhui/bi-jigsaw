import { memo } from 'react';
import ChartWidget from '../../common/ChartWidget';
import { IBarWidgetProps } from '../types';

const BarWidget: React.FC<IBarWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/bar" />
  );
});

export default BarWidget;

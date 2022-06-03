import { memo } from 'react';
import { ILineWidgetProps } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const LineWidget: React.FC<ILineWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/line" />
  );
});

export default LineWidget;

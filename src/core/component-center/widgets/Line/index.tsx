import { memo } from 'react';
import ChartWidget from '../../common/ChartWidget';
import { ILineWidgetProps } from '../types';

const LineWidget: React.FC<ILineWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/line" />
  );
});

export default LineWidget;

import { memo } from 'react';
import { IPieWidgetProps } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const PieWidget: React.FC<IPieWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/pie" />
  );
});

export default PieWidget;

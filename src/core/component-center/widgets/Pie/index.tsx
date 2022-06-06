import { memo } from 'react';
import ChartWidget from '../../common/ChartWidget';
import { IPieWidgetProps } from '../types';

const PieWidget: React.FC<IPieWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/pie" />
  );
});

export default PieWidget;

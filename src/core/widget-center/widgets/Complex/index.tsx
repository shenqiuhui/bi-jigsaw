import { memo } from 'react';
import { IComplexWidgetProps } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const ComplexWidget: React.FC<IComplexWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/complex" />
  );
});

export default ComplexWidget;

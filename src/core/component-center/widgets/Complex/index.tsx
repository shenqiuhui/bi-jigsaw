import { memo } from 'react';
import ChartWidget from '../../common/ChartWidget';
import { IComplexWidgetProps } from '../types';

const ComplexWidget: React.FC<IComplexWidgetProps> = memo((props) => {
  return (
    <ChartWidget {...props} api="/api/complex" />
  );
});

export default ComplexWidget;

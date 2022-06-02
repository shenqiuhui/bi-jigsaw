import { memo, forwardRef } from 'react';
import { IComplexWidgetProps, IWidgetRef } from '@/types';
import ChartWidget from '../../common/ChartWidget';

const ComplexWidget = memo(forwardRef<IWidgetRef, IComplexWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/complex" />
  );
}));

export default ComplexWidget;

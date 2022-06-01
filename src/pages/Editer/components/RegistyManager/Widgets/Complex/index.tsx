import { memo, forwardRef } from 'react';
import ChartWidget from '../../Common/ChartWidget';
import { IComplexWidgetProps, IWidgetRef } from '../../../../types';

const ComplexWidget = memo(forwardRef<IWidgetRef, IComplexWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/getComplexData" />
  );
}));

export default ComplexWidget;

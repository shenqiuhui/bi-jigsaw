import { memo, forwardRef } from 'react';
import ChartWidget from '../../Common/ChartWidget';
import { IPieWidgetProps, IWidgetRef } from '../../../../types';

const PieWidget = memo(forwardRef<IWidgetRef, IPieWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/getPieData" />
  );
}));

export default PieWidget;

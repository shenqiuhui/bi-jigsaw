import { memo, forwardRef } from 'react';
import ChartWidget from '../../Common/ChartWidget';
import { ILineWidgetProps, IWidgetRef } from '../../../../types';

const LineWidget = memo(forwardRef<IWidgetRef, ILineWidgetProps>((props, ref) => {
  return (
    <ChartWidget ref={ref} {...props} api="/api/getLineData" />
  );
}))

export default LineWidget;

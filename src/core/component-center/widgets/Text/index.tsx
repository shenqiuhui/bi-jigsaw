import { memo, useMemo } from 'react';
import { TextWidgetProps } from '../types';

import './index.less';

const TextWidget: React.FC<TextWidgetProps> = memo((props) => {
  const { isEdit, settings, emptyRender, dropdownRender } = props;

  const hasValue = useMemo(() => {
    return !!settings?.style?.value;
  }, [settings?.style?.value]);

  return (
    <div
      className="text-widget-container"
      style={hasValue ? {
        fontSize: settings?.style?.fontSize,
        color: settings?.style?.color,
        backgroundColor: settings?.style?.backgroundColor,
      } : {}}
    >
      {hasValue ? (
        <pre>
          {settings?.style?.value}
        </pre>
      ) : emptyRender?.()}
      {isEdit && (
        <div className="text-widget-operate">
          {dropdownRender?.()}
        </div>
      )}
    </div>
  );
});

export default TextWidget;

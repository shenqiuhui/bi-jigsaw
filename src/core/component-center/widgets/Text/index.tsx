import { memo, useMemo } from 'react';
import classNames from 'classnames';
import { TextWidgetProps } from '../types';

import './index.less';

const TextWidget: React.FC<TextWidgetProps> = memo((props) => {
  const { theme = 'light', isEdit, settings, emptyRender, dropdownRender } = props;

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
        <div
          className={classNames({
            'text-widget-operate': true,
            'text-widget-operate-light': theme === 'light',
            'text-widget-operate-dark': theme === 'dark'
          })}
        >
          {dropdownRender?.()}
        </div>
      )}
    </div>
  );
});

export default TextWidget;

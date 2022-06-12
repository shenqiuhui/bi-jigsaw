import { useState } from 'react';
import { SketchPicker, SketchPickerProps, ColorResult } from 'react-color';
import classNames from 'classnames';

import './index.less';

interface ColorPickerProps extends SketchPickerProps {
  value?: string;
  placement?: 'topLeft' | 'top' | 'topRight' | 'bottomLeft' | 'bottom' | 'bottomRight';
  onChange?: (value: ColorResult) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { value, placement = 'bottomLeft', onChange, ...otherProps } = props;
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    setVisible(visible => !visible);
  }

  const handleClose = () => {
    setVisible(false);
  }

  const handleChange = (value: ColorResult) => {
    onChange?.(value);
  }

  return (
    <div className="color-picker-container">
      <div
        className="color-picker-swatch-wrapper"
        onClick={handleToggle}
      >
        <div
          className="color-picker-swatch"
          style={{ background: value }}
        />
      </div>
      {visible && (
        <div
          className={classNames({
            'color-picker-popover': true,
            [`color-picker-popover-${placement}`]: true
          })}
        >
          <div
            className="color-picker-cover"
            onClick={handleClose}
          />
          <SketchPicker
            className="color-picker"
            color={value}
            onChange={handleChange}
            {...otherProps}
          />
        </div>
      )}
    </div>
  );
}

export default ColorPicker;

import { useMemo } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';

import './index.less';

interface ItemGroupProps {
  theme?: string;
  label?: string | React.ReactNode;
  padding?: number | number[];
  children?: React.ReactNode;
  extra?: () => React.ReactNode;
}

const { Item } = Form;

const ItemGroup: React.FC<ItemGroupProps> = (props) => {
  const { theme = 'light', label, padding = 12, children, extra, ...otherProps } = props;

  const paddingStyle = useMemo(() => {
    if (Array.isArray(padding)) {
      return padding.map((value) => `${value}px`).join(' ');
    } else {
      return padding;
    }
  }, [padding]);

  return (
    <Item label={label} {...otherProps}>
      <div
        className={classNames({
          'item-group-container': true,
          'item-group-container-light': theme === 'light',
          'item-group-container-dark': theme === 'dark'
        })}
        style={{ padding: paddingStyle }}
      >
        <div className="item-group-extra">
          {extra?.()}
        </div>
        {children}
      </div>
    </Item>
  )
}

export default ItemGroup;

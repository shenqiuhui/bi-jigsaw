import { useMemo } from 'react';
import { Form } from 'antd';

import './index.less';

interface IItemGroupProps {
  label?: string | React.ReactNode;
  padding?: number | number[];
  children?: React.ReactNode;
  extra?: () => React.ReactNode;
}

const { Item } = Form;

const ItemGroup: React.FC<IItemGroupProps> = (props) => {
  const { label, padding = 12, children, extra, ...otherProps } = props;

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
        className="item-group-container"
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

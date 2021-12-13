import React from 'react';
import { Form } from 'antd';

import './index.less';

interface IItemGroupProps {
  label?: string | React.ReactNode;
  children?: React.ReactNode;
}

const { Item } = Form;

const ItemGroup: React.FC<IItemGroupProps> = (props) => {
  const { label, children, ...otherProps } = props;

  return (
    <Item label={label} {...otherProps}>
      <div className="item-group-container">
        {children}
      </div>
    </Item>
  )
}

export default ItemGroup;

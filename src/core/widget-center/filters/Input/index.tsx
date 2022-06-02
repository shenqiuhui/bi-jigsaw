import React from 'react';
import { Input } from 'antd';
import { IInputProps } from '@/types';

const InputItem: React.FC<IInputProps> = (props) => {
  const { width } = props;

  return (
    <Input style={ width ? { width } : {} } {...props} />
  );
};

export default InputItem;

import { InputNumber } from 'antd';
import { IInputNumberProps } from '../types';

const InputNumberItem: React.FC<IInputNumberProps> = (props) => {
  const { width } = props;

  return (
    <InputNumber style={ width ? { width } : {} } {...props} />
  );
};

export default InputNumberItem;

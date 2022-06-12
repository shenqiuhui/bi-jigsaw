import { InputNumber } from 'antd';
import { InputNumberProps } from '../types';

const InputNumberItem: React.FC<InputNumberProps> = (props) => {
  const { width } = props;

  return (
    <InputNumber style={ width ? { width } : {} } {...props} />
  );
};

export default InputNumberItem;

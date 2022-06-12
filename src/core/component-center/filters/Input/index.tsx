import { Input } from 'antd';
import { InputProps } from '../types';

const InputItem: React.FC<InputProps> = (props) => {
  const { width } = props;

  return (
    <Input style={ width ? { width } : {} } {...props} />
  );
};

export default InputItem;

import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import { PickerProps, MomentType } from '../types';

const PickerItem: React.FC<PickerProps> = (props) => {
  const { mode = 'time', width, format, value, onChange } = props;

  const handleChange = (_time: MomentType | null, timeString: string) => {
    onChange(timeString);
  }

  return mode === 'time' ? (
    <TimePicker
      style={ width ? { width } : {} }
      value={value ? moment(value, format) : null}
      onChange={handleChange}
    />
  ) : (
    <DatePicker
      style={ width ? { width } : {} }
      value={value ? moment(value, format) : null}
      onChange={handleChange}
    />
  );
};

export default PickerItem;

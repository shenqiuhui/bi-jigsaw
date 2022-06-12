import { useMemo, useCallback } from 'react';
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import { rangeDatePreset } from './config';
import { RangePickerProps, MomentRangeType } from '../types';

interface RangeMapType {
  [key: string]: MomentRangeType;
}

const { RangePicker: TimeRangePicker } = TimePicker;
const { RangePicker: DateRangePicker } = DatePicker;

const RangePickerItem: React.FC<RangePickerProps> = (props) => {
  const { mode = 'time', presetShortcuts = [], width, format, value, onChange } = props;

  const initialValue = useMemo<MomentRangeType | null>(() => {
    return value && [moment(value?.[0], format), moment(value?.[1], format)];
  }, [format, value]);

  const ranges = useMemo<RangeMapType>(() => {
    return presetShortcuts?.reduce((result, key) => {
      if (rangeDatePreset[key]) {
        const { name, range } = rangeDatePreset[key];
        result[name] = range;
      }

      return result;
    }, {} as RangeMapType);
  }, [rangeDatePreset, presetShortcuts]);

  const handleChange = useCallback((time, timeString) => {
    onChange(time ? timeString : time);
  }, [onChange]);

  return mode === 'time' ? (
    <TimeRangePicker
      style={ width ? { width } : {} }
      value={initialValue}
      onChange={handleChange}
    />
  ) : (
    <DateRangePicker
      style={ width ? { width } : {} }
      value={initialValue}
      ranges={ranges}
      onChange={handleChange}
    />
  );
};

export default RangePickerItem;

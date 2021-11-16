import React, { useMemo, useCallback } from 'react';
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import { rangeDatePreset } from './config';
import { IRangePickerProps, MomentRangeType } from '../../../../types';

const { RangePicker: TimeRangePicker } = TimePicker;
const { RangePicker: DateRangePicker } = DatePicker;

const RangePickerItem: React.FC<IRangePickerProps> = (props) => {
  const { mode = 'time', preset = true, width, format, value, onChange } = props;

  const initalValue = useMemo<MomentRangeType | null>(() => {
    return value && [moment(value?.[0], format), moment(value?.[1], format)];
  }, [format, value]);

  const ranges = useMemo(() => {
    return preset ? rangeDatePreset : {};
  }, [preset]);

  const handleChange = useCallback((time, timeString) => {
    onChange(time ? timeString : time);
  }, [onChange]);

  return mode === 'time' ? (
    <TimeRangePicker
      style={ width ? { width } : {} }
      value={initalValue}
      onChange={handleChange}
    />
  ) : (
    <DateRangePicker
      style={ width ? { width } : {} }
      value={initalValue}
      ranges={ranges}
      onChange={handleChange}
    />
  );
};

export default RangePickerItem;

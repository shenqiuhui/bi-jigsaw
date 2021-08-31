import React, { useMemo, useCallback } from 'react';
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import { IRangePickerProps, MomentRangeType } from '../../../../types';

const { RangePicker: TimeRangePicker } = TimePicker;
const { RangePicker: DateRangePicker } = DatePicker;

const RangePickerItem: React.FC<IRangePickerProps> = (props) => {
  const { mode = 'time', width, format, value, onChange } = props;

  const initalValue = useMemo<MomentRangeType | null>(() => {
    return value && [moment(value?.[0], format), moment(value?.[1], format)];
  }, [format, value]);

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
      onChange={handleChange}
    />
  );
};

export default RangePickerItem;

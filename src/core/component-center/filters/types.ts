import { FilterConditionType, OptionType, WidgetFieldType, DefaultValueType } from '@/core/render-engine';
import { RegisterBaseType } from '@/core/register';

export interface SelectProps extends FilterConditionType {
  pageId: string;
  api: string;
  method: 'get' | 'post';
  dataSource: OptionType[];
  widgetFieldList: WidgetFieldType[];
  width: number | string;
  mode: 'multiple' | 'tags';
}

export type PickerRangeValueType = [string, string];

export type MomentRangeType = [moment.Moment, moment.Moment];

export type MomentType = moment.Moment;

export interface RangePresetType {
  [key: string]: {
    name: string;
    range: MomentRangeType;
  };
}

export interface RangePickerProps extends FilterConditionType {
  mode: 'time' | 'date';
  presetShortcuts?: React.Key[];
  width?: number | string;
  format: string;
  value: PickerRangeValueType;
  onChange: (timeString: PickerRangeValueType) => void;
}

export interface PickerProps extends FilterConditionType {
  mode: 'time' | 'date';
  width?: number | string;
  format: string;
  value: string | null | undefined;
  onChange: (timeString: string) => void;
}

export interface InputNumberProps extends FilterConditionType {
  width?: number | string;
  keyboard: boolean;
}

export interface InputProps extends FilterConditionType {
  width?: number | string;
  allowClear: boolean;
  placeholder: string;
}

export interface FilterComponentType extends RegisterBaseType {
  emptyValue: DefaultValueType;
  hasDefaultValue: boolean;
  props: {
    [key: string]: any;
  };
}

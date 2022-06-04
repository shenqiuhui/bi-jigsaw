import { IFilterCondition, IOption, IWidgetField } from '@/core/render-engine/types';

export interface ISelectProps extends IFilterCondition {
  pageId: number;
  api: string;
  method: 'get' | 'post';
  dataSource: IOption[];
  widgetFieldList: IWidgetField[];
  width: number | string;
  mode: 'multiple' | 'tags';
}

export type PickerRangeValueType = [string, string];
export type MomentRangeType = [moment.Moment, moment.Moment];
export type MomentType = moment.Moment;

export interface IRangePreset {
  [key: string]: MomentRangeType;
}

export interface IRangePickerProps extends IFilterCondition {
  mode: 'time' | 'date';
  preset?: boolean;
  width?: number | string;
  format: string;
  value: PickerRangeValueType;
  onChange: (timeString: PickerRangeValueType) => void;
}

export interface IPickerProps extends IFilterCondition {
  mode: 'time' | 'date';
  width?: number | string;
  format: string;
  value: string | null | undefined;
  onChange: (timeString: string) => void;
}

export interface IInputNumberProps extends IFilterCondition {
  width?: number | string;
  keyboard: boolean;
}

export interface IInputProps extends IFilterCondition {
  width?: number | string;
  allowClear: boolean;
  placeholder: string;
}

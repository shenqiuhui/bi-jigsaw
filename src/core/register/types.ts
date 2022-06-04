import { IWidgetCommon, DefaultValueType, IWidget, IDataSetting } from '@/core/render-engine/types';

export interface IComponentMap {
  [key: string]: any
}

export interface IConfigMap {
  [key: string]: any
}

export interface IFieldSet {
  fieldKey: string;
  fieldName: string;
}

export interface IPathOptions {
  namespace: string;
  type: string;
  name: string;
  isComponent?: boolean;
}

export interface IRegister {
  type?: string;
  name?: string;
  component?: Function;
}

export interface IWidgetMap {
  [key: string]: IWidgetCommon;
}

export interface IWidgetSettingMap {
  [key: string]: IWidgetSetting;
}

export interface IWidgetSetting extends IRegister {
  hasTab: boolean;
}

export interface IFilterComponentMap {
  [key: string]: IFilterComponent;
}

export interface IFilterComponent extends IRegister {
  emptyValue: DefaultValueType;
  hasDefaultValue: boolean;
  props: {
    [key: string]: any;
  };
}

export interface IWidgetButtons {
  type: string;
  name: string;
}

export type INewWidget = Omit<IWidget, 'id' | 'coordinate'>;

export interface IWidgetConfig {
  [key: string]: INewWidget;
}

export interface IDataSettingConfig {
  [key: string]: IDataSetting;
}

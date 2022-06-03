import moment from 'moment';
import { IGirdProps } from '@/pages/Editor/components/Grid';
import {
  IFilterCondition,
  IPageConfig,
  IWidget as IWidgetGlobal,
  Settings,
  IPageSetting,
  IDataSetting,
  IWidgetField
} from '@/store/types';

// 组件注册通用类型
export interface IRegister {
  type?: string;
  name?: string;
  component?: Function;
}

// 筛选组件
export type MomentType = moment.Moment;

export type MomentRangeType = [moment.Moment, moment.Moment];

export type PickerRangeValueType = [string, string];

export type DefaultValueType = string | string[] | never[] | null;

export interface IRangePreset {
  [key: string]: MomentRangeType;
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

export interface IOption {
  value: string;
  label: string;
}

export interface ISelectProps extends IFilterCondition {
  pageId: number;
  api: string;
  method: 'get' | 'post';
  dataSource: IOption[];
  widgetFieldList: IWidgetField[];
  width: number | string;
  mode: 'multiple' | 'tags';
}

export interface IPickerProps extends IFilterCondition {
  mode: 'time' | 'date';
  width?: number | string;
  format: string;
  value: string | null | undefined;
  onChange: (timeString: string) => void;
}

export interface IRangePickerProps extends IFilterCondition {
  mode: 'time' | 'date';
  preset?: boolean;
  width?: number | string;
  format: string;
  value: PickerRangeValueType;
  onChange: (timeString: PickerRangeValueType) => void;
}

export interface IInputProps extends IFilterCondition {
  width?: number | string;
  allowClear: boolean;
  placeholder: string;
}

export interface IInputNumberProps extends IFilterCondition {
  width?: number | string;
  keyboard: boolean;
}

// FilterModal 组件
export interface IFilterConfig {
  pageId: number;
  list: IListRecord[];
}

export interface IListRecord {
  id: string;
  name: string;
  isShow: boolean;
  filterItemType: string | null;
  defaultValue?: DefaultValueType;
  checkedWidgets: React.Key[];
  widgetFieldList: IWidgetField[];
  dateRangeType?: string;
  dateRangeDynamicValue?: DefaultValueType;
  isEdit?: boolean;
}

export interface IFieldData {
  field: string;
  fieldType: string;
  name: string;
}

// 图表组件
export interface IWidgetSize {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  defaultW?: number;
  defaultH?: number;
}

export interface IWidgetMap {
  [key: string]: IWidget;
}

export interface IWidgetMethods {
  fetchData?: (settings: Settings) => Promise<any>;
  exportData?: (settings: Settings) => Promise<any>;
  downloadImage?: () => void;
}

export interface IWidgetButtons {
  type: string;
  name: string;
}

export interface IFilterForm {
  [key: string]: string | string[] | number | undefined;
}

export interface IWidgetDefaultProps extends IWidget, Omit<IWidgetGlobal, 'type'> {
  pageId: number;
  isEdit: boolean;
  isSelected: string;
  filterValues: IFilterForm;
  api: string;
  emptyRender: (offset?: number) => React.ReactNode;
  titleRender: () => React.ReactNode;
  dropdownRender: () => React.ReactNode;
  refreshRender: () => React.ReactNode;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
  onWatchInfoChange?: (info: any) => void;
  methodsRegister?: (methods: IWidgetMethods) => void;
}

export interface IWidget extends IRegister, IWidgetSize {
  showHeader: boolean;
  useLoading: boolean;
  showInFilter: boolean;
}

export interface ITabsWidgetProps extends IWidgetDefaultProps {
  pageConfig: IPageConfig;
  allWidgets: IWidgetGlobal[],
  selectedWidgetId?: string | null | undefined;
  gridContainerRender?: (props: IGirdProps) => React.ReactNode;
  onWidgetSelect?: (id: string, type: string, settings: Settings) => void;
  onWidgetsUpdate?: (widgets: IWidgetGlobal[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: IPageConfig) => void;
  onTabsInfoChange?: (id: string, activeTab: string, height: number) => void;
}

export interface ITableWidgetProps extends IWidgetDefaultProps {}

export interface ILineWidgetProps extends IWidgetDefaultProps {}

export interface IBarWidgetProps extends IWidgetDefaultProps {}

export interface IPieWidgetProps extends IWidgetDefaultProps {}

export interface IComplexWidgetProps extends IWidgetDefaultProps {}

export interface ITextWidgetProps extends IWidgetDefaultProps {}

// 图表设置表单
export interface ITabsDefaultProps {
  hasTab: boolean;
  type: string;
  activeTab: string;
  pageId: number;
  spaceId: string;
  widgetId: string;
  onWatchInfoChange?: (info: any) => void;
  onPageSettingChange?: (pageSetting: IPageSetting) => void;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
}
export interface IWidgetSettingMap {
  [key: string]: IWidgetSetting;
}

export interface IWidgetSetting extends IRegister {
  hasTab: boolean;
}

export interface IPageSettingProps extends ITabsDefaultProps {
  settings: IPageSetting;
}

export interface ITabsSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface ITableSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface ILineSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface IBarSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface IPieSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface IComplexSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

export interface ITextSettingProps extends ITabsDefaultProps {
  settings: Settings;
}

// 图表配置
export type INewWidget = Omit<IWidgetGlobal, 'id' | 'coordinate'>;

export interface IWidgetConfig {
  [key: string]: INewWidget;
}

// 渲染引擎
export interface IRenderEngine {
  config: IPageConfig;
  isEdit?: boolean;
  ref?: React.MutableRefObject<IGridRef | null>;
  selectedWidgetId?: string | null;
  onFilterConfigSubmit?: (config: IFilterConfig) => void;
  onWidgetSelect?: (id: string, type: string, settings: Settings) => void;
  onWidgetsUpdate?: (widgets: IWidgetGlobal[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: IPageConfig) => void;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
}

export interface IGridRef {
  watchHandlers: IWatchHandlers;
}

export interface IWatchHandlers {
  [key: string]: (info: any) => void;
}

export interface IWidgetContainerRef {
  widgetId: string;
  handler: (info: any) => void;
}

// 设置调度模块
export interface ITabsContainerRefs {
  activeKeyInit: () => void;
}

export interface IDataSettingConfig {
  [key: string]: IDataSetting;
}

export interface IPlanData {
  planId: number;
  planName: string;
}

export interface IMaskVisibleMap {
  [key: string]: boolean;
}

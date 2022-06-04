import { IRegister } from '@/core/register/types';

/* 渲染引擎 */
export interface IRenderEngine {
  config: IPageConfig;
  isEdit?: boolean;
  ref?: React.MutableRefObject<IGridRef | null>;
  selectedWidgetId?: string | null;
  onFilterConfigSubmit?: () => void;
  onWidgetSelect?: (id: string, type: string, settings: Settings) => void;
  onWidgetsUpdate?: (widgets: IWidget[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: IPageConfig) => void;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
}

/* 监听控制器集合 */
export interface IGridRef {
  watchHandlers: IWatchHandlers;
}

export interface IWatchHandlers {
  [key: string]: (info: any) => void;
}

/* 过滤器 JSON Scheme */
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
  presetShortcuts?: React.Key[];
  isEdit?: boolean;
}

export type DefaultValueType = string | string[] | never[] | null;

export interface IOption {
  value: string;
  label: string;
}

export interface IFieldData {
  field: string;
  fieldType: string;
  name: string;
}

/* 页面 JSON Scheme */
export interface IPageConfig {
  pageId: number;
  spaceId: string;
  name: string;
  description: string;
  theme: string;
  filters: {
    conditions: IFilterCondition[];
  };
  widgets: IWidget[];
}

export interface IFilterCondition {
  widgetFieldList: IWidgetField[];
  type: string;
  fieldValue: string;
  fieldName: string;
  initialValue?: string | string[] | number;
  checkedWidgets?: string[];
  widgetFieldMap?: {
    [key: string]: string | undefined;
  };
}

export interface IWidget {
  parentId?: string;
  id: string;
  newWidget?: boolean;
  parentID?: string;
  type: string;
  coordinate: ICoordinate;
  tabs?: ITab[];
  settings: Settings;
}

export interface IWidgetField {
  planId: number;
  field: string;
  widgetId: string;
}

export interface ICoordinate {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export interface ITab {
  key: string;
  name: string;
  widgets?: IWidget[];
}

export type Settings = {
  [key: string]: SettingKeys;
};

export type SettingKeys = ITabsSetting['data']
  & ITabsSetting['style']
  & ITableSetting['data']
  & ITableSetting['style']
  & IComplexSetting['data']
  & IComplexSetting['style']
  & IPieSetting['data']
  & IPieSetting['style']
  & ITextSetting['data']
  & ITextSetting['style'];

export interface IPageSetting {
  name: string;
  description: string;
  theme: string;
}

export interface ITabsSetting {
  data: {},
  style: {
    title?: string;
    showTitle?: boolean;
    align?: string;
    tabs?: ITab[];
  };
}

export interface ITableSetting {
  data: {
    planId?: number | null;
    planName?: string;
    showType?: string;
    indicators?: IDataSetting[];
    dimensions?: IDataSetting[];
    filters?: IDataSetting[];
  };
  style: {
    title?: string;
    showTitle?: boolean;
    pageSize?: number;
  }
}

export interface IComplexSetting {
  data: {
    planId?: number | null;
    planName?: string;
    indicators?: IDataSetting[];
    dimensions?: IDataSetting[];
    legends?: IDataSetting[];
    filters?: IDataSetting[];
  };
  style: {
    title?: string;
    showTitle?: boolean;
    legend?: string;
    yAxisAll?: boolean;
    xAxis?: {
      title?: string;
    };
    yAxisLeft?: {
      title?: string;
      fields?: string[];
      rangeValues?: number[] | null[];
    }
    yAxisRight?: {
      title?: string;
      fields?: string[];
      rangeValues?: number[] | null[];
    }
  }
}

export interface IPieSetting {
  data: {
    planId?: number | null;
    planName?: string;
    indicators?: IDataSetting[];
    dimensions?: IDataSetting[];
    filters?: IDataSetting[];
  };
  style: {
    title?: string;
    showTitle?: boolean;
    showType?: string;
    radiusPercentage?: number;
    labels?: string[];
  };
}

export interface ITextSetting {
  data: {},
  style: {
    value?: string | null | undefined;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
  }
}

export interface IDragItem {
  field: string;
  fieldType: string;
  name: string;
}

export interface IDataSetting extends IDragItem {
  rename: string;
  align: string;
  order: string;
  aggregatefunc: string;
  formatType: string;
  filterMethodType: string;
  enumFilterType: string;
  enumFilterValue: string;
  enumFilterValues: string[];
  conditionFilterType: string;
  conditionFilterValue: string;
  ratioNumeratorAggregatefunc: string;
  ratioNumeratorField: string | null;
  ratioDenominatorAggregatefunc: string;
  ratioDenominatorField: string | null;
  showType?: string;
}

/* 栅格画布 */
export interface IGirdProps {
  ref?: any;
  inner?: boolean;
  pageConfig: IPageConfig;
  isEdit: boolean;
  widgets: IWidget[];
  selectedWidgetId?: string | null | undefined;
  filterValues: IFilterForm;
  onWidgetSelect?: ((id: string, type: string, settings: Settings) => void) | undefined;
  onWidgetsUpdate?: ((widgets: IWidget[], action?: string, updateData?: boolean) => void) | undefined;
  onPageConfigUpdate?: ((config: IPageConfig) => void) | undefined;
  onDataSettingChange?: ((dataSettings: Settings['data']) => void) | undefined;
  onStyleSettingChange?: ((styleSettings: Settings['style']) => void) | undefined;
}

export interface IMaskVisibleMap {
  [key: string]: boolean;
}

/* 组件和组件容器 */
export interface IWidgetMethods {
  fetchData?: (form: IFilterForm, settings: Settings, watchInfo: any) => Promise<any>;
  exportData?: (form: IFilterForm, settings: Settings, watchInfo: any) => Promise<any>;
  downloadImage?: (form: IFilterForm, watchInfo: any) => void;
}

export interface IFilterForm {
  [key: string]: string | string[] | number | undefined;
}

export interface IWidgetSize {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  defaultW?: number;
  defaultH?: number;
}

export interface IWidgetCommon extends IRegister, IWidgetSize {
  showHeader: boolean;
  useLoading: boolean;
  showInFilter: boolean;
}

export interface IWidgetDefaultProps extends IWidgetCommon, Omit<IWidget, 'type'> {
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

export interface IWidgetContainerRef {
  widgetId: string;
  handler: (info: any) => void;
}

/* 链接参数 */
export interface IDashboardParams {
  pageId: string;
  spaceId: string;
};

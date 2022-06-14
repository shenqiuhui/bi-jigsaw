import { WidgetCommonType } from '@/core/component-center/widgets';

/* 渲染引擎 */
export interface RenderEngineType {
  config: PageConfigType;
  isEdit?: boolean;
  ref?: React.MutableRefObject<GridRefType | null>;
  selectedWidgetId?: string | null;
  onFilterConfigSubmit?: () => void;
  onWidgetSelect?: (id: string, type: string, settings: SettingType) => void;
  onWidgetsUpdate?: (widgets: WidgetType[], action?: string, updateData?: boolean) => void;
  onPageConfigUpdate?: (config: PageConfigType) => void;
  onDataSettingChange?: (dataSettings: SettingType['data']) => void;
  onStyleSettingChange?: (styleSettings: SettingType['style']) => void;
}

/* 监听控制器集合 */
export interface GridRefType {
  watchHandlers: WatchHandlersType;
}

export interface WatchHandlersType {
  [key: string]: (info: any) => void;
}

/* 过滤器 JSON Scheme */
export interface FilterConfigType {
  pageId: string;
  list: ListRecordType[];
}

export interface ListRecordType {
  id: string;
  name: string;
  isShow: boolean;
  filterItemType: string | null;
  defaultValue?: DefaultValueType;
  checkedWidgets: React.Key[];
  widgetFieldList: WidgetFieldType[];
  dateRangeType?: string;
  dateRangeDynamicValue?: DefaultValueType;
  presetShortcuts?: React.Key[];
  isEdit?: boolean;
}

export type DefaultValueType = string | string[] | never[] | null;

export interface OptionType {
  value: string;
  label: string;
}

export interface FieldDataType {
  field: string;
  fieldType: string;
  name: string;
}

/* 页面 JSON Scheme */
export interface PageConfigType {
  pageId: string;
  spaceId: string;
  name: string;
  description: string;
  theme: string;
  filters: {
    conditions: FilterConditionType[];
  };
  widgets: WidgetType[];
}

export interface FilterConditionType {
  widgetFieldList: WidgetFieldType[];
  type: string;
  fieldValue: string;
  fieldName: string;
  initialValue?: string | string[] | number;
  checkedWidgets?: string[];
  widgetFieldMap?: {
    [key: string]: string | undefined;
  };
}

export interface WidgetType {
  parentId?: string;
  id: string;
  newWidget?: boolean;
  parentID?: string;
  type: string;
  coordinate: CoordinateType;
  tabs?: TabType[];
  settings: SettingType;
}

export interface WidgetFieldType {
  planId: number;
  field: string;
  widgetId: string;
}

export interface CoordinateType {
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

export interface TabType {
  key: string;
  name: string;
  widgets?: WidgetType[];
}

export type SettingType = {
  [key: string]: SettingKeyType;
};

export type SettingKeyType = TabsSettingType['data']
  & TabsSettingType['style']
  & TableSettingType['data']
  & TableSettingType['style']
  & ComplexSettingType['data']
  & ComplexSettingType['style']
  & PieSettingType['data']
  & PieSettingType['style']
  & TextSettingType['data']
  & TextSettingType['style'];

export interface PageSettingType {
  name: string;
  description: string;
  theme: string;
}

export interface TabsSettingType {
  data: {},
  style: {
    title?: string;
    showTitle?: boolean;
    align?: string;
    tabs?: TabType[];
  };
}

export interface TableSettingType {
  data: {
    planId?: number | null;
    planName?: string;
    showType?: string;
    indicators?: DataSettingType[];
    dimensions?: DataSettingType[];
    filters?: DataSettingType[];
  };
  style: {
    title?: string;
    showTitle?: boolean;
    pageSize?: number;
  }
}

export interface ComplexSettingType {
  data: {
    planId?: number | null;
    planName?: string;
    indicators?: DataSettingType[];
    dimensions?: DataSettingType[];
    legends?: DataSettingType[];
    filters?: DataSettingType[];
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

export interface PieSettingType {
  data: {
    planId?: number | null;
    planName?: string;
    indicators?: DataSettingType[];
    dimensions?: DataSettingType[];
    filters?: DataSettingType[];
  };
  style: {
    title?: string;
    showTitle?: boolean;
    legend?: string;
    showType?: string;
    radiusPercentage?: number;
    labels?: string[];
  };
}

export interface TextSettingType {
  data: {},
  style: {
    value?: string | null | undefined;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
  }
}

export interface DragType {
  field: string;
  fieldType: string;
  name: string;
}

export interface DataSettingType extends DragType {
  rename: string;
  align: string;
  order: string;
  aggregatefunc: string;
  formatType: string;
  filterMethodType: string;
  enumFilterType: string;
  enumFilterValue: string | null;
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
export interface GirdProps {
  ref?: any;
  inner?: boolean;
  pageConfig: PageConfigType;
  isEdit: boolean;
  widgets: WidgetType[];
  selectedWidgetId?: string | null | undefined;
  filterValues: FilterFormType;
  onWidgetSelect?: ((id: string, type: string, settings: SettingType) => void) | undefined;
  onWidgetsUpdate?: ((widgets: WidgetType[], action?: string, updateData?: boolean) => void) | undefined;
  onPageConfigUpdate?: ((config: PageConfigType) => void) | undefined;
  onDataSettingChange?: ((dataSettings: SettingType['data']) => void) | undefined;
  onStyleSettingChange?: ((styleSettings: SettingType['style']) => void) | undefined;
}

export interface MaskVisibleMapType {
  [key: string]: boolean;
}

/* 组件和组件容器 */
export interface WidgetMethodsType {
  fetchData?: (form: FilterFormType, settings: SettingType, watchInfo: any) => Promise<any>;
  exportData?: (form: FilterFormType, settings: SettingType, watchInfo: any) => Promise<any>;
  downloadImage?: (form: FilterFormType, watchInfo: any) => void;
}

export interface FilterFormType {
  [key: string]: string | string[] | number | undefined;
}

export interface WidgetSizeType {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  defaultW?: number;
  defaultH?: number;
}

export interface WidgetDefaultProps extends WidgetCommonType, Omit<WidgetType, 'type'> {
  theme?:string;
  pageId: string;
  isEdit: boolean;
  isSelected: string;
  filterValues: FilterFormType;
  api: string;
  emptyRender: (offset?: number) => React.ReactNode;
  titleRender: () => React.ReactNode;
  dropdownRender: () => React.ReactNode;
  refreshRender: () => React.ReactNode;
  onDataSettingChange?: (dataSettings: SettingType['data']) => void;
  onStyleSettingChange?: (styleSettings: SettingType['style']) => void;
  onWatchInfoChange?: (info: any) => void;
  methodsRegister?: (methods: WidgetMethodsType) => void;
}

export interface WidgetContainerRefType {
  widgetId: string;
  handler: (info: any) => void;
}

/* 链接参数 */
export interface DashboardParamsType {
  pageId: string;
  spaceId: string;
};

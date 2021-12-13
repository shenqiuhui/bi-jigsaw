/* 仪表板类型 */
export interface IDashboardState {
  spaceData: ISpaceData;
  pageConfig: IPageConfig;
  pageStatus: string;
};

export interface ISpaceData {
  spaceId: number;
  spaceName: string;
}

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

export interface IFilterForm {
  [key: string]: string | string[] | number | undefined;
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

export interface IWidgetField {
  planId: number;
  field: string;
  widgetId: string;
}

export interface IWidget {
  parentId?: string;
  id: string;
  newWidget?: boolean;
  parentID?: string;
  type: string;
  coordinate: ICoordinate;
  tabs?: ITabs[];
  settings: Settings;
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

export interface ITabs {
  key: string;
  name: string;
  widgets?: IWidget[];
}

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

export type Settings = {
  [key: string]: SettingKeys;
};

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
    tabs?: ITabs[];
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

/* 状态类型汇总 */
export interface IRootState {
  dashboard: IDashboardState;
};

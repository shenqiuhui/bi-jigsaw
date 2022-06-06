import {
  // TabsWidget,
  TableWidget,
  LineWidget,
  BarWidget,
  PieWidget,
  ComplexWidget,
  TextWidget
} from '@/core/component-center/widgets';
import {
  // ITabsWidgetProps,
  ITableWidgetProps,
  ILineWidgetProps,
  IBarWidgetProps,
  IPieWidgetProps,
  IComplexWidgetProps,
  ITextWidgetProps
} from '@/core/component-center/widgets/types';
import { IWidgetCommon } from '@/core/render-engine/types';
import { IWidgetMap, IWidgetButtons } from '../types';
import Register from '../methods';

// 注册标签页组件
// Register.componentRegister<IWidget, ITabsWidgetProps>(TabsWidget, {
//   namespace: 'widgets',
//   type: 'tabs',
//   name: '标签页'
// }, {
//   minW: 6,
//   minH: 18,
//   defaultW: 12,
//   defaultH: 20,
//   hasRef: false,
//   showHeader: false,
//   useLoading: false,
//   showInFilter: false
// });

// 注册表格组件
Register.componentRegister<IWidgetCommon, ITableWidgetProps>(TableWidget, {
  namespace: 'widgets',
  type: 'table',
  name: '表格'
}, {
  minW: 4,
  minH: 12,
  defaultW: 12,
  defaultH: 20,
  showHeader: true,
  useLoading: true,
  showInFilter: true
});

// 注册折线图组件
Register.componentRegister<IWidgetCommon, ILineWidgetProps>(LineWidget, {
  namespace: 'widgets',
  type: 'line',
  name: '折线图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  showHeader: true,
  useLoading: true,
  showInFilter: true
});

// 注册柱状图组件
Register.componentRegister<IWidgetCommon, IBarWidgetProps>(BarWidget, {
  namespace: 'widgets',
  type: 'bar',
  name: '柱状图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  showHeader: true,
  useLoading: true,
  showInFilter: true
});

// 注册饼图组件
Register.componentRegister<IWidgetCommon, IPieWidgetProps>(PieWidget, {
  namespace: 'widgets',
  type: 'pie',
  name: '饼图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  showHeader: true,
  useLoading: true,
  showInFilter: true
});

// 注册组合图组件
Register.componentRegister<IWidgetCommon, IComplexWidgetProps>(ComplexWidget, {
  namespace: 'widgets',
  type: 'complex',
  name: '组合图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  showHeader: true,
  useLoading: true,
  showInFilter: true
});

// 注册文本组件
Register.componentRegister<IWidgetCommon, ITextWidgetProps>(TextWidget, {
  namespace: 'widgets',
  type: 'text',
  name: '文本'
}, {
  minW: 2,
  minH: 3,
  defaultW: 12,
  defaultH: 10,
  showHeader: false,
  useLoading: false,
  showInFilter: false
});

export const widgetMap: IWidgetMap = Register.getComponents('widgets');
export const widgetButtons: IWidgetButtons[] = Register.generateEnumListByComponent<IWidgetButtons>('widgets', {
  fieldKey: 'type',
  fieldName: 'name'
});

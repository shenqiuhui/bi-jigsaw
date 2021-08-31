import Register from '../methods';
import {
  // TabsWidget,
  TableWidget,
  LineWidget,
  BarWidget,
  PieWidget,
  ComplexWidget
} from '../../components/RegistyManager/Widgets';
import {
  // ITabsWidgetProps,
  ITableWidgetProps,
  ILineWidgetProps,
  IBarWidgetProps,
  IPieWidgetProps,
  IComplexWidgetProps,
  IWidgetMap,
  IWidget,
  IWidgetButtons,
} from '../../types';

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
// });

// 注册表格组件
Register.componentRegister<IWidget, ITableWidgetProps>(TableWidget, {
  namespace: 'widgets',
  type: 'table',
  name: '表格'
}, {
  minW: 4,
  minH: 12,
  defaultW: 12,
  defaultH: 20,
  hasRef: true,
  showHeader: true,
});

// 注册折线图组件
Register.componentRegister<IWidget, ILineWidgetProps>(LineWidget, {
  namespace: 'widgets',
  type: 'line',
  name: '折线图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  hasRef: true,
  showHeader: true,
});

// 注册柱状图组件
Register.componentRegister<IWidget, IBarWidgetProps>(BarWidget, {
  namespace: 'widgets',
  type: 'bar',
  name: '柱状图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  hasRef: true,
  showHeader: true,
});

// 注册饼图组件
Register.componentRegister<IWidget, IPieWidgetProps>(PieWidget, {
  namespace: 'widgets',
  type: 'pie',
  name: '饼图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  hasRef: true,
  showHeader: true,
});

// 注册组合图组件
Register.componentRegister<IWidget, IComplexWidgetProps>(ComplexWidget, {
  namespace: 'widgets',
  type: 'complex',
  name: '组合图'
}, {
  minW: 3,
  minH: 12,
  defaultW: 6,
  defaultH: 20,
  hasRef: true,
  showHeader: true,
});

export const widgetMap: IWidgetMap = Register.getComponents('widgets');
export const widgetButtons: IWidgetButtons[] = Register.generateEnumListByComponent<IWidgetButtons>('widgets', {
  fieldKey: 'type',
  fieldName: 'name'
});

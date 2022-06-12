import { RegisterType } from '@/core/register';
import {
  // TabsWidget,
  TableWidget,
  LineWidget,
  BarWidget,
  PieWidget,
  ComplexWidget,
  TextWidget,
  // TabsWidgetProps,
  TableWidgetProps,
  LineWidgetProps,
  BarWidgetProps,
  PieWidgetProps,
  ComplexWidgetProps,
  TextWidgetProps,
  WidgetCommonType
} from '@/core/component-center/widgets';

const widgetRegister = ({ componentRegister }: RegisterType) => {
  // 注册标签页组件
  // componentRegister<WidgetCommonType, TabsWidgetProps>(TabsWidget, {
  //   namespace: 'widgets',
  //   type: 'tabs',
  //   name: '标签页'
  // }, {
  //   minW: 6,
  //   minH: 18,
  //   defaultW: 12,
  //   defaultH: 20,
  //   showHeader: false,
  //   useLoading: false,
  //   showInFilter: false
  // });

  // 注册表格组件
  componentRegister<WidgetCommonType, TableWidgetProps>(TableWidget, {
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
  componentRegister<WidgetCommonType, LineWidgetProps>(LineWidget, {
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
  componentRegister<WidgetCommonType, BarWidgetProps>(BarWidget, {
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
  componentRegister<WidgetCommonType, PieWidgetProps>(PieWidget, {
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
  componentRegister<WidgetCommonType, ComplexWidgetProps>(ComplexWidget, {
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
  componentRegister<WidgetCommonType, TextWidgetProps>(TextWidget, {
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
}

export default widgetRegister;

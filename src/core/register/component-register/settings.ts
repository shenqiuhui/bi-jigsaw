import {
  PageSetting,
  // TabsSetting,
  TableSetting,
  LineSetting,
  BarSetting,
  PieSetting,
  ComplexSetting,
  TextSetting
} from '@/core/component-center/settings';
import {
  IPageSettingProps,
  // ITabSettingProps,
  ITableSettingProps,
  ILineSettingProps,
  IBarSettingProps,
  IPieSettingProps,
  IComplexSettingProps,
  ITextSettingProps
} from '@/core/component-center/settings/types';
import { IWidgetSettingMap, IWidgetSetting } from '../types';
import Register from '../methods';

// 注册默认设置组件
Register.componentRegister<IWidgetSetting, IPageSettingProps>(PageSetting, {
  namespace: 'settings',
  type: 'page',
  name: '页面设置'
}, {
  hasTab: false,
});

// 注册标签页设置组件
// Register.componentRegister<IWidgetSetting, ITabSettingProps>(TabsSetting, {
//   namespace: 'settings',
//   type: 'tabs',
//   name: '标签页设置'
// }, {
//   hasTab: false,
// });

// 注册表格设置组件
Register.componentRegister<IWidgetSetting, ITableSettingProps>(TableSetting, {
  namespace: 'settings',
  type: 'table',
  name: '表格设置'
}, {
  hasTab: true,
});

// 注册折线图设置组件
Register.componentRegister<IWidgetSetting, ILineSettingProps>(LineSetting, {
  namespace: 'settings',
  type: 'line',
  name: '折线图设置'
}, {
  hasTab: true,
});

// 注册柱状图设置组件
Register.componentRegister<IWidgetSetting, IBarSettingProps>(BarSetting, {
  namespace: 'settings',
  type: 'bar',
  name: '柱状图设置'
}, {
  hasTab: true,
});

// 注册柱状图设置组件
Register.componentRegister<IWidgetSetting, IPieSettingProps>(PieSetting, {
  namespace: 'settings',
  type: 'pie',
  name: '饼图设置'
}, {
  hasTab: true,
});

// 注册组合图设置组件
Register.componentRegister<IWidgetSetting, IComplexSettingProps>(ComplexSetting, {
  namespace: 'settings',
  type: 'complex',
  name: '组合图设置'
}, {
  hasTab: true,
});

// 注册文本设置组件
Register.componentRegister<IWidgetSetting, ITextSettingProps>(TextSetting, {
  namespace: 'settings',
  type: 'text',
  name: '文本设置'
}, {
  hasTab: false,
});

export const widgetSettingMap: IWidgetSettingMap = Register.getComponents('settings');

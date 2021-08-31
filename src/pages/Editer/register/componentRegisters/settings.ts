import Register from '../methods';
import {
  PageSetting,
  TabsSetting,
  TableSetting,
  LineSetting,
  BarSetting,
  PieSetting,
  ComplexSetting
} from '../../components/RegistyManager/Settings';
import {
  IPageSettingProps,
  ITabsSettingProps,
  ITableSettingProps,
  ILineSettingProps,
  IBarSettingProps,
  IPieSettingProps,
  IComplexSettingProps,
  IWidgetSettingMap,
  IWidgetSetting,
} from '../../types';

// 注册默认设置组件
Register.componentRegister<IWidgetSetting, IPageSettingProps>(PageSetting, {
  namespace: 'settings',
  type: 'page',
  name: '页面设置'
}, {
  hasTab: false,
});

// 注册标签页设置组件
Register.componentRegister<IWidgetSetting, ITabsSettingProps>(TabsSetting, {
  namespace: 'settings',
  type: 'tabs',
  name: '标签页设置'
}, {
  hasTab: false,
});

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

export const widgetSettingMap: IWidgetSettingMap = Register.getComponents('settings');

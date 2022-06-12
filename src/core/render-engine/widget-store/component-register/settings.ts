import { RegisterType } from '@/core/register';
import {
  PageSetting,
  // TabsSetting,
  TableSetting,
  LineSetting,
  BarSetting,
  PieSetting,
  ComplexSetting,
  TextSetting,
  PageSettingProps,
  // TabsSettingProps,
  TableSettingProps,
  LineSettingProps,
  BarSettingProps,
  PieSettingProps,
  ComplexSettingProps,
  TextSettingProps,
  WidgetSettingType
} from '@/core/component-center/settings';

const settingRegister = ({ componentRegister }: RegisterType) => {
  // 注册默认设置组件
  componentRegister<WidgetSettingType, PageSettingProps>(PageSetting, {
    namespace: 'settings',
    type: 'page',
    name: '页面设置'
  }, {
    hasTab: false,
  });

  // 注册标签页设置组件
  // componentRegister<WidgetSettingType, TabsSettingProps>(TabsSetting, {
  //   namespace: 'settings',
  //   type: 'tabs',
  //   name: '标签页设置'
  // }, {
  //   hasTab: false,
  // });

  // 注册表格设置组件
  componentRegister<WidgetSettingType, TableSettingProps>(TableSetting, {
    namespace: 'settings',
    type: 'table',
    name: '表格设置'
  }, {
    hasTab: true,
  });

  // 注册折线图设置组件
  componentRegister<WidgetSettingType, LineSettingProps>(LineSetting, {
    namespace: 'settings',
    type: 'line',
    name: '折线图设置'
  }, {
    hasTab: true,
  });

  // 注册柱状图设置组件
  componentRegister<WidgetSettingType, BarSettingProps>(BarSetting, {
    namespace: 'settings',
    type: 'bar',
    name: '柱状图设置'
  }, {
    hasTab: true,
  });

  // 注册柱状图设置组件
  componentRegister<WidgetSettingType, PieSettingProps>(PieSetting, {
    namespace: 'settings',
    type: 'pie',
    name: '饼图设置'
  }, {
    hasTab: true,
  });

  // 注册组合图设置组件
  componentRegister<WidgetSettingType, ComplexSettingProps>(ComplexSetting, {
    namespace: 'settings',
    type: 'complex',
    name: '组合图设置'
  }, {
    hasTab: true,
  });

  // 注册文本设置组件
  componentRegister<WidgetSettingType, TextSettingProps>(TextSetting, {
    namespace: 'settings',
    type: 'text',
    name: '文本设置'
  }, {
    hasTab: false,
  });
}

export default settingRegister;

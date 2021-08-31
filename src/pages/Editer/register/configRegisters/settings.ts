import Register from '../methods';
import { IDataSetting } from '@/store/types';
import { IDataSettingConfig } from '../../types';

// 注册维度指标设置项默认配置
Register.configRegister<IDataSetting>({
  namespace: 'settings',
  type: 'defaultParams',
  name: '组件数据维度/指标/图例/过滤器设置默认值'
}, {
  field: '',
  fieldType: '1',
  name: '',
  rename: '',
  align: 'center',
  order: 'none',
  aggregatefunc: '',
  formatType: '1',
  filterMethodType: '2',
  enumFilterType: '1',
  enumFilterValue: '',
  enumFilterValues: [],
  conditionFilterType: '1',
  conditionFilterValue: '',
  showType: '1'
});

export const dataSettingConfig: IDataSettingConfig = Register.getConfig('settings');

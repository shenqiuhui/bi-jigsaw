import { RegisterType } from '@/core/register';
import { DataSettingType } from '@/core/render-engine';

const settingsConfigRegister = ({ configRegister }: RegisterType) => {
  // 注册维度指标设置项默认配置
  configRegister<DataSettingType>({
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
    enumFilterValue: null,
    enumFilterValues: [],
    conditionFilterType: '1',
    conditionFilterValue: '',
    ratioNumeratorAggregatefunc: 'sum',
    ratioNumeratorField: null,
    ratioDenominatorAggregatefunc: 'sum',
    ratioDenominatorField: null,
    showType: '1'
  });
}

export default settingsConfigRegister;

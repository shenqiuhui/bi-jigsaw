import {
  SelectItem,
  PickerItem,
  RangePickerItem,
  InputItem,
  InputNumberItem
} from '@/core/widget-center/filters';
import {
  ISelectProps,
  IPickerProps,
  IRangePickerProps,
  IInputProps,
  IInputNumberProps
} from '@/core/widget-center/filters/types';
import { IOption } from '@/core/render-engine/types';
import { IFilterComponentMap, IFilterComponent } from '../types';
import Register from '../methods';

// 注册单选组件
Register.componentRegister<IFilterComponent, ISelectProps>(SelectItem, {
  namespace: 'filters',
  type: 'select',
  name: '单选'
}, {
  emptyValue: null,
  hasDefaultValue: true,
  props: {
    width: 300,
    allowClear: true,
    showSearch: true,
    filterOption: true,
    optionFilterProp: 'label',
    placeholder: '请选择',
    api: '/api/options',
    method: 'post'
  },
});

// 注册多选组件
Register.componentRegister<IFilterComponent, ISelectProps>(SelectItem, {
  namespace: 'filters',
  type: 'select-multiple',
  name: '多选'
}, {
  emptyValue: [],
  hasDefaultValue: true,
  props: {
    width: 300,
    allowClear: true,
    showArrow: true,
    maxTagCount: 1,
    filterOption: true,
    optionFilterProp: 'label',
    placeholder: '请选择',
    mode: 'multiple',
    api: '/api/multiple-options',
    method: 'post'
  },
});

// 注册日期组件
Register.componentRegister<IFilterComponent, IPickerProps>(PickerItem, {
  namespace: 'filters',
  type: 'date',
  name: '日期'
}, {
  emptyValue: null,
  hasDefaultValue: true,
  props: {
    format: 'YYYY-MM-DD',
    mode: 'date'
  },
});

// 注册日期范围组件
Register.componentRegister<IFilterComponent, IRangePickerProps>(RangePickerItem, {
  namespace: 'filters',
  type: 'date-range',
  name: '日期范围'
}, {
  emptyValue: null,
  hasDefaultValue: true,
  props: {
    format: 'YYYY-MM-DD',
    mode: 'date'
  },
});

// 注册搜索输入组件
Register.componentRegister<IFilterComponent, IInputProps>(InputItem, {
  namespace: 'filters',
  type: 'input',
  name: '搜索输入'
}, {
  emptyValue: null,
  hasDefaultValue: false,
  props: {
    allowClear: true,
    placeholder: '请输入',
    autoComplete: 'off'
  },
});

// 注册数字输入组件
Register.componentRegister<IFilterComponent, IInputNumberProps>(InputNumberItem, {
  namespace: 'filters',
  type: 'input-number',
  name: '数字输入'
}, {
  emptyValue: null,
  hasDefaultValue: false,
  props: {
    keyboard: true,
    placeholder: '请输入'
  },
});

// 注册时间组件
Register.componentRegister<IFilterComponent, IPickerProps>(PickerItem, {
  namespace: 'filters',
  type: 'time',
  name: '时间'
}, {
  emptyValue: null,
  hasDefaultValue: true,
  props: {
    format: 'HH:mm:ss'
  },
});

// 注册时间范围组件
Register.componentRegister<IFilterComponent, IRangePickerProps>(RangePickerItem, {
  namespace: 'filters',
  type: 'time-range',
  name: '时间范围'
}, {
  emptyValue: null,
  hasDefaultValue: true,
  props: {
    format: 'HH:mm:ss'
  },
});

export const filterComponentMap: IFilterComponentMap = Register.getComponents('filters');
export const selectDataSource: IOption[]  = Register.generateEnumListByComponent<IOption>('filters');

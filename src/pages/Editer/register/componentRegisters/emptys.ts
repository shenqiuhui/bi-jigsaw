import Register from '../methods';
import {
  // TabsEmpty,
  TableEmpty,
  LineEmpty,
  BarEmpty,
  PieEmpty,
  ComplexEmpty,
  TextEmpty
} from '../../components/RegistyManager/WidgetEmptys';

// 注册标签页为空组件
// Register.componentRegister(TabsEmpty, {
//   namespace: 'emptys',
//   type: 'tabs',
//   name: '标签页数据为空'
// }, {});

// 注册表格为空组件
Register.componentRegister(TableEmpty, {
  namespace: 'emptys',
  type: 'table',
  name: '表格数据为空'
}, {});

// 注册折线图为空组件
Register.componentRegister(LineEmpty, {
  namespace: 'emptys',
  type: 'line',
  name: '折线图数据为空'
}, {});

// 注册柱形图为空组件
Register.componentRegister(BarEmpty, {
  namespace: 'emptys',
  type: 'bar',
  name: '柱形图数据为空'
}, {});

// 注册饼图为空组件
Register.componentRegister(PieEmpty, {
  namespace: 'emptys',
  type: 'pie',
  name: '饼图数据为空'
}, {});

// 注册饼图为空组件
Register.componentRegister(ComplexEmpty, {
  namespace: 'emptys',
  type: 'complex',
  name: '组合图数据为空'
}, {});

// 注册文本为空组件
Register.componentRegister(TextEmpty, {
  namespace: 'emptys',
  type: 'text',
  name: '文本数据为空'
}, {});

export const widgetEmptyMap = Register.getComponents('emptys');

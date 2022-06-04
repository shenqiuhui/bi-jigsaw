import { INewWidget, IWidgetConfig } from '@/core/register/types';
import Register from '../methods';

// 注册标签页组件初始值
// Register.configRegister<INewWidget>({
//   namespace: 'widgets',
//   type: 'tabs',
//   name: '标签页'
// }, {
//   type: 'tabs',
//   tabs: [],
//   settings: {
//     style: {
//       title: '标签页',
//       showTitle: true,
//       align: 'right',
//       tabs: [
//         {
//           key: '',
//           name: 'Tab1'
//         },
//         {
//           key: '',
//           name: 'Tab2'
//         }
//       ]
//     }
//   }
// });

// 注册表格组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'table',
  name: '表格'
}, {
  type: 'table',
  settings: {
    data: {
      planId: null,
      planName: '',
      showType: '2',
      indicators: [],
      dimensions: [],
      filters: []
    },
    style: {
      title: '表格',
      showTitle: true,
      pageSize: 10,
    }
  }
});

// 注册折线图组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'line',
  name: '折线图'
}, {
  type: 'line',
  settings: {
    data: {
      planId: null,
      planName: '',
      showType: '2',
      indicators: [],
      dimensions: [],
      legends: [],
      filters: []
    },
    style: {
      title: '折线图',
      showTitle: true,
      legend: 'top',
      yAxisAll: false,
      xAxis: {
        title: ''
      },
      yAxisLeft: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
      yAxisRight: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
    }
  }
});

// 注册柱状图组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'bar',
  name: '柱状图'
}, {
  type: 'bar',
  settings: {
    data: {
      planId: null,
      planName: '',
      showType: '2',
      indicators: [],
      dimensions: [],
      legends: [],
      filters: []
    },
    style: {
      title: '柱状图',
      showTitle: true,
      legend: 'top',
      yAxisAll: false,
      xAxis: {
        title: ''
      },
      yAxisLeft: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
      yAxisRight: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
    }
  }
});

// 注册饼图组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'pie',
  name: '饼图'
}, {
  type: 'pie',
  settings: {
    data: {
      planId: null,
      planName: '',
      showType: '2',
      indicators: [],
      dimensions: [],
      filters: []
    },
    style: {
      title: '饼图',
      showTitle: true,
      showType: '1',
      radiusPercentage: 10,
      labels: []
    }
  }
});

// 注册组合图组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'complex',
  name: '组合图'
}, {
  type: 'complex',
  settings: {
    data: {
      planId: null,
      planName: '',
      showType: '2',
      indicators: [],
      dimensions: [],
      legends: [],
      filters: []
    },
    style: {
      title: '组合图',
      showTitle: true,
      legend: 'top',
      yAxisAll: false,
      xAxis: {
        title: ''
      },
      yAxisLeft: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
      yAxisRight: {
        title: '',
        fields: [],
        rangeValues: [null, null]
      },
    }
  }
});

// 注册文本组件初始值
Register.configRegister<INewWidget>({
  namespace: 'widgets',
  type: 'text',
  name: '文本'
}, {
  type: 'text',
  settings: {
    style: {
      value: null,
      fontSize: 14,
      color: '#000000',
      backgroundColor: '#FFFFFF'
    }
  }
});

export const widgetConfig: IWidgetConfig = Register.getConfig('widgets');

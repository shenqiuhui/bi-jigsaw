import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import moment from 'moment';
import Router from './router';
import store from './store';
import reportWebVitals from './reportWebVitals';
import 'moment/dist/locale/zh-cn';

import './index.less';

moment.locale('zh-cn');

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <Router />
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);

reportWebVitals();

import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import Router from './router';
import store from './store';

import './index.less';

ReactDOM.render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ConfigProvider>
  </StrictMode>,
  document.getElementById('root')
);

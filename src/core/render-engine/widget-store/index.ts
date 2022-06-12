import { init } from '@/core/register';
import filterRegister from './component-register/filters';
import widgetRegister from './component-register/widgets';
import settingRegister from './component-register/settings';
import emptyRegister from './component-register/emptys';

import widgetsConfigRegister from './config-register/widgets';
import settingsConfigRegister from './config-register/settings';

// 初始化注册中心
const widgetStore = init({
  component: [
    filterRegister,
    widgetRegister,
    settingRegister,
    emptyRegister
  ],
  config: [
    widgetsConfigRegister,
    settingsConfigRegister
  ]
});

export default widgetStore;

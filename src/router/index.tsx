import { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { RegisterProvider } from '@/core/register';
import { widgetStore } from '@/core/render-engine';
import routes from './routes';

const Router = () => (
  <RegisterProvider value={widgetStore}>
    <HashRouter>
      <Suspense fallback>
        {renderRoutes(routes)}
      </Suspense>
    </HashRouter>
  </RegisterProvider>
);

export default Router;

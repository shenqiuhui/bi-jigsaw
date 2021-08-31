import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

import './index.less';

const PreviewLayout: React.FC<RouteConfigComponentProps<any>> = (props) => {
  const { route } = props;

  return (
    <div className="preview-layout">
      {renderRoutes(route?.routes)}
    </div>
  );
}

export default PreviewLayout;

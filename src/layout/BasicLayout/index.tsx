import { Layout } from 'antd';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

import './index.less';

const { Header, Content } = Layout;

const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  const { route } = props;

  return (
    <Layout className="base-layout">
      <Header className="base-layout-header">
        <h1>BI 可视化页面搭建案例</h1>
      </Header>
      <Content className="base-content">
        {renderRoutes(route?.routes)}
      </Content>
    </Layout>
  );
};

export default BasicLayout;

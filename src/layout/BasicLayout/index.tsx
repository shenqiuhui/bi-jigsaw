import { Layout } from 'antd';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

import './index.less';

const { Header, Content } = Layout;

const BasicLayout: React.FC<RouteConfigComponentProps<any>> = (props) => {
  const { route } = props;

  return (
    <Layout className="base-layout">
      <Header>
        <h1>BI 平台</h1>
      </Header>
      <Content className="base-content">
        {renderRoutes(route?.routes)}
      </Content>
    </Layout>
  );
};

export default BasicLayout;

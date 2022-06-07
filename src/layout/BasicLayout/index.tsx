import { useEffect } from 'react';
import { Layout, Alert, Avatar } from 'antd';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { getUserInfo } from '@/service/apis/home';
import { setUserInfo } from '@/store/slices/user';
import { IRootState } from '@/store/types';

import './index.less';

const { Header, Content } = Layout;

const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  const { route } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: IRootState) => state.user);

  const fetchUserInfo = async () => {
    try {
      const res: any = await getUserInfo();
      dispatch(setUserInfo(res));
    } catch (err) {}
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Layout className="base-layout">
      <Header className="base-layout-header">
        <h1>
          BI 可视化页面搭建案例
        </h1>
        {userInfo.userName && (
          <div className="avatar">
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="user-name">
              {userInfo.userName}
            </span>
          </div>
        )}
      </Header>
      <Alert
        banner
        closable
        message="主要用来展示可视化看板搭建思路，仪表板均为 Mock 数据，保存功能不生效！"
      />
      <Content className="base-content">
        {renderRoutes(route?.routes)}
      </Content>
    </Layout>
  );
};

export default BasicLayout;

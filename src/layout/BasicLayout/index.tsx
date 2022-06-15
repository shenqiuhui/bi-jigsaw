import { useState, useEffect } from 'react';
import { Layout, Alert, Avatar } from 'antd';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { getUserInfo } from '@/service/apis/home';
import { ThemeWrapper } from '@/core/render-engine';
import { setUserInfo } from '@/store/slices/user';
import { RootStateType } from '@/store';

import './index.less';

const { Header, Content } = Layout;

const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  const { route } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootStateType) => state.user);
  const [theme, setTheme] = useState('light');

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
    <ThemeWrapper theme={'light'}>
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
          message="主要用来展示可视化看板低代码搭建思路，仪表板均为 Mock 数据，保存暂不生效！"
        />
        <Content className="base-content">
          {renderRoutes(route?.routes)}
        </Content>
      </Layout>
    </ThemeWrapper>
  );
};

export default BasicLayout;

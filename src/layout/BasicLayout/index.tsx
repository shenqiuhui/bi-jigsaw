import { useState, useEffect } from 'react';
import { Layout, Popover, Form, Switch, Alert, Avatar } from 'antd';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { UserOutlined, SettingFilled, SettingOutlined } from '@ant-design/icons';
import { getUserInfo } from '@/service/apis/home';
import { ThemeWrapper } from '@/core/render-engine';
import { setUserInfo } from '@/store/slices/user';
import { RootStateType } from '@/store';

import './index.less';

const { Header, Content } = Layout;
const { Item } = Form;

const BasicLayout: React.FC<RouteConfigComponentProps> = (props) => {
  const { route } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootStateType) => state.user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const fetchUserInfo = async () => {
    try {
      const res: any = await getUserInfo();
      dispatch(setUserInfo(res));
    } catch (err) {}
  }

  const handleThemeChange = (checked: boolean) => {
    const value = checked ? 'dark' : 'light';
    setTheme(value);
    localStorage.setItem('theme', value);
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <ThemeWrapper theme={theme}>
      <Layout className="base-layout">
        <Header
          className={classNames({
            'base-layout-header': true,
            'light-theme-base-layout-header': theme === 'light',
            'dark-theme-base-layout-header': theme === 'dark',
          })}
        >
          <h1>
            BI 可视化页面搭建案例
          </h1>
          <div className="operate-wrapper">
            <Popover
              trigger="click"
              overlayClassName="home-setting-content"
              content={
                <Form>
                  <Item className="form-item-horizontal" label="深色主题" >
                    <Switch
                      checked={theme === 'dark'}
                      onChange={handleThemeChange}
                    />
                  </Item>
                </Form>
              }
            >
              {theme === 'light' ? (
                <SettingFilled className="setting-icon" />
              ) : (
                <SettingOutlined className="setting-icon" />
              )}
            </Popover>
            {userInfo.userName && (
              <div className="avatar">
                <Avatar size="large" icon={<UserOutlined />} />
                <span className="user-name">
                  {userInfo.userName}
                </span>
              </div>
            )}
          </div>
        </Header>
        <Alert
          banner
          closable
          message="主要用来展示可视化看板低代码搭建思路，仪表板均为 Mock 数据，保存功能暂不生效！"
        />
        <Content className="base-content">
          {renderRoutes(route?.routes)}
        </Content>
      </Layout>
    </ThemeWrapper>
  );
};

export default BasicLayout;

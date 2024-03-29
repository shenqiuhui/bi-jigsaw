import { useState, useEffect } from 'react';
import { Empty, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { isBoolean } from 'lodash-es';
import { DashboardParamsType } from '../../types';

import './index.less';

interface AuthInfo {
  hasAuth: boolean;
  info: string;
}

const authInfo = new Map([
  [0, { hasAuth: false, info: '无查看该仪表板权限，请找到所有者添加' }],
  [1, { hasAuth: true, info: '' }],
  [2, { hasAuth: false, info: '仪表板不存在' }]
]);

const AuthHOC = <T extends {}>(Component: React.ComponentType<T>, fetchAPI: Function) => (props: T) => {
  const { spaceId, pageId } = useParams<DashboardParamsType>();
  const [auth, setAuth] = useState<AuthInfo>();

  const fetchAuth = async () => {
    if (spaceId && pageId) {
      try {
        const res: any = await fetchAPI?.({
          spaceId,
          pageId
        });

        setAuth(authInfo.get(res?.status));
      } catch (err) {}
    }
  }

  const goHomePage = () => {
    window.open('/');
  }

  useEffect(() => {
    fetchAuth();
  }, []);

  return isBoolean(auth?.hasAuth) ? (
    <>
      {auth?.hasAuth ? (
        <Component {...props} />
      ) : (
        <div className="page-no-access">
          <Empty description={auth?.info}>
            <Button
              className="go-home-btn"
              type="link"
              onClick={goHomePage}
            >
              返回首页
            </Button>
          </Empty>
        </div>
      )}
    </>
  ) : null;
}

export default AuthHOC;

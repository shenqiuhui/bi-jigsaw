import { useState, useMemo, useEffect } from 'react';
import { Spin, Layout } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import classNames from 'classnames';
import { checkDashboardAuth } from '@/service/apis/auth';
import { getPageConfig } from '@/service/apis/dashboard';
import { ThemeWrapper, renderEngine, AuthHOC, PageConfigType, DashboardParamsType } from '@/core/render-engine';

import './index.less';

interface PreviewProps {}

const { Header, Content } = Layout;

const Preview: React.FC<PreviewProps> = () => {
  const location = useLocation();
  const { pageId } = useParams<DashboardParamsType>();

  const [loading, setLoading] = useState(false);
  const [pageConfig, setPageConfig] = useState<PageConfigType>({} as PageConfigType);

  const query = qs.parse(location?.search.slice(1));

  const header = useMemo(() => {
    return query?.header && query?.header === 'false' ? false : true;
  }, [query?.header]);

  // 获取页面配置数据
  const fetchPageConfig = async () => {
    if (pageId) {
      setLoading(true);

      try {
        const res: any = await getPageConfig({
          pageId
        });

        setPageConfig(res);
      } catch (err) {}

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPageConfig();
  }, []);

  return (
    <ThemeWrapper theme={pageConfig?.theme}>
      <Layout className="preview-container">
        {header && (
          <Header
            className={classNames({
              'preview-header': true,
              'light-theme-preview-header': pageConfig?.theme === 'light',
              'dark-theme-preview-header': pageConfig?.theme === 'dark',
            })}
          >
            {pageConfig?.name}
          </Header>
        )}
        <Content className="preview-content">
          <Spin size="large" spinning={loading}>
            {renderEngine({
              config: pageConfig
            })}
          </Spin>
        </Content>
      </Layout>
    </ThemeWrapper>
  );
}

export default AuthHOC(Preview, checkDashboardAuth);

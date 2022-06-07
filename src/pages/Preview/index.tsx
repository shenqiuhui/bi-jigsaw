import { useState, useMemo, useEffect } from 'react';
import { Spin, Layout } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import { renderEngine } from '@/core/render-engine';
import { checkDashboardAuth } from '@/service/apis/auth';
import { getPageConfig } from '@/service/apis/dashboard';
import { AuthHOC } from '@/core/render-engine';
import { IPageConfig, IDashboardParams } from '@/core/render-engine/types';

import './index.less';

interface IPreviewProps {}

const { Header, Content } = Layout;

const Preview: React.FC<IPreviewProps> = () => {
  const location = useLocation();
  const { pageId } = useParams<IDashboardParams>();

  const [loading, setLoading] = useState(false);
  const [pageConfig, setPageConfig] = useState<IPageConfig>({} as IPageConfig);

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
    <Layout className="preview-container">
      {header && (
        <Header className="preview-header">
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
  );
}

export default AuthHOC(Preview, checkDashboardAuth);

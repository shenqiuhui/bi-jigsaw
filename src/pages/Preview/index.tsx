import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { renderEngine } from '@/core/render-engine';
import { checkDashboardAuth } from '@/service/apis/auth';
import { getPageConfig } from '@/service/apis/dashboard';
import { AuthHOC } from '@/core/render-engine';
import { IPageConfig, IDashboardParams } from '@/core/render-engine/types';

import './index.less';

interface IPreviewProps {}

const Preview: React.FC<IPreviewProps> = () => {
  const { pageId } = useParams<IDashboardParams>();
  const [loading, setLoading] = useState(false);
  const [pageConfig, setPageConfig] = useState<IPageConfig>({} as IPageConfig);

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
    <div className="preview-container">
      <Spin size="large" spinning={loading}>
        {renderEngine({
          config: pageConfig
        })}
      </Spin>
    </div>
  );
}

export default AuthHOC(Preview, checkDashboardAuth);

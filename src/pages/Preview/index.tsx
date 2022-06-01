import React, { useState, useCallback, useEffect } from 'react';
import { Spin, Empty } from 'antd';
import { useParams } from 'react-router-dom';
import { renderEngine } from '@/pages/Editer';
import { getPageConfig } from '@/service/dashboardApi';
import { checkPreviewAuth } from '@/service/dashboardApi';
import { IPageConfig } from '@/store/types';

import './index.less';

interface IPreviewProps {}

interface IRouteParams {
  pageId: string;
  spaceId: string;
};

const Preview: React.FC<IPreviewProps> = () => {
  const { spaceId, pageId } = useParams<IRouteParams>();
  const [loading, setLoading] = useState(false);
  const [pageConfig, setPageConfig] = useState<IPageConfig>({} as IPageConfig);
  const [hasAuth, setHasAuth] = useState(false);
  const [authWait, setAuthWait] = useState(true);

  // 获取权限接口
  const fetchAuth = useCallback(async () => {
    if (spaceId && pageId) {
      try {
        const res: any = await checkPreviewAuth({
          spaceId,
          pageId
        });

        setHasAuth(res);
      } catch (err) {}

      setAuthWait(false);
    }
  }, [pageId, spaceId]);

  // 获取页面配置数据
  const fetchPageConfig = useCallback(async () => {
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
  }, [pageId]);

  useEffect(() => {
    if (hasAuth) {
      fetchPageConfig();
    }
  }, [fetchPageConfig, hasAuth]);

  useEffect(() => {
    fetchAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preview-container">
      {!authWait && (
        <>
          {hasAuth? (
            <Spin size="large" spinning={loading}>
              {renderEngine({
                config: pageConfig
              })}
            </Spin>
          ) : (
            <div className="page-no-access">
              <Empty description="无查看该仪表板权限，请找到所有者添加" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Preview;

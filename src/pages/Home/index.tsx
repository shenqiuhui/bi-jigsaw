import { useState, useMemo, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { Card, Button, Select, Collapse, Radio, RadioChangeEvent } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppstoreOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import { getSpaceList, getDashboardList } from '@/service/apis/home';
import { IOption } from '@/core/render-engine/types';
import CustomCard from './components/CustomCard';
import CustomList from './components/CustomList';

import './index.less';

interface ISpaceItem {
  spaceId: string;
  spaceName: string;
}

export interface IDashboardItem {
  id: string;
  name: string;
  spaceId: string;
  spaceName: string;
  description: string;
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}

export const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

const { Panel } = Collapse;

const Home = () => {
  const [mode, setMode] = useState('card');
  const [spaceList, setSpaceList] = useState<ISpaceItem[]>([]);
  const [spaceId, setSpaceId] = useState('all');
  const [dashboardList, setDashboardList] = useState<IDashboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const spaceOptions = useMemo<IOption[]>(() => spaceList?.reduce((memo, { spaceId, spaceName }) => (memo.push({
    value: spaceId,
    label: spaceName
  }), memo), [{
    value: 'all',
    label: '全部'
  }]), [spaceList]);

  const fetchSpaceList = async () => {
    try {
      const res: any = await getSpaceList();

      setSpaceList(res);
    } catch (err) {}
  }

  const fetchDashboardList = async () => {
    setLoading(true);

    try {
      const res: any = await getDashboardList({
        spaceId
      });

      setDashboardList(res);
    } catch (err) {}

    setLoading(false);
  }

  const handleModeChange = (event: RadioChangeEvent) => {
    setMode(event?.target?.value);
  }

  const handleSpaceChange = (value: string) => {
    setSpaceId(value);
  }

  const handlePreview = (spaceId: string, pageId: string) => {
    const pathname = window.location.pathname;
    window.open(`${pathname}#/preview/${spaceId}/${pageId}`);
  }

  const handleIframePreview = (spaceId: string, pageId: string) => {
    const pathname = window.location.pathname;
    window.open(`${pathname}#/preview/iframe/${spaceId}/${pageId}`);
  }

  const handleEdit = (spaceId: string, pageId: string) => {
    const pathname = window.location.pathname;
    window.open(`${pathname}#/editor/${spaceId}/${pageId}`);
  }

  const spaceSelectorRender = () => (
    <Select
      className="space-select"
      placeholder="请选择"
      optionFilterProp="label"
      value={spaceId}
      showSearch
      filterOption
      options={spaceOptions}
      onChange={handleSpaceChange}
    />
  );

  const layoutControllerRender = () => (
    <Radio.Group
      buttonStyle="solid"
      value={mode}
      onChange={handleModeChange}
    >
      <Radio.Button value="card">
        <AppstoreOutlined />
      </Radio.Button>
      <Radio.Button value="list">
        <BarsOutlined />
      </Radio.Button>
    </Radio.Group>
  );

  const tipsRender = () => (
    <Collapse defaultActiveKey="tips">
      <Panel
        key="tips"
        header="路由说明"
        extra={<FileTextOutlined />}
      >
        <Button
          type="link"
          onClick={() => handlePreview('20398', '1')}
        >
          预览 ~/preview/:spaceId/:pageId
        </Button>
        <br />
        <Button
          type="link"
          onClick={() => handleIframePreview('20398', '1')}
        >
          iframe嵌入 ~/preview/iframe/:spaceId/:pageId
        </Button>
        <br />
        <Button
          type="link"
          onClick={() => handleEdit('20398', '1')}
        >
          编辑器 ~/editor/:spaceId/:pageId
        </Button>
      </Panel>
    </Collapse>
  );

  useUpdateEffect(() => {
    fetchDashboardList();
  }, [spaceId]);

  useEffect(() => {
    fetchSpaceList();
    fetchDashboardList();
  }, []);

  return (
    <div className="home-container">
      <Card
        className="dashboard-list-card"
        bodyStyle={{ padding: 0, height: 'calc(100% - 64px)'}}
        title={spaceSelectorRender()}
        extra={layoutControllerRender()}
      >
        <div className="list-wrapper">
          <div className="tips">
            {tipsRender()}
          </div>
          {mode === 'card' && (
            <CustomCard
              loading={loading}
              dataSource={dashboardList}
              onPreview={handlePreview}
              onIframePreview={handleIframePreview}
              onEdit={handleEdit}
            />
          )}
          {mode === 'list' && (
            <CustomList
              loading={loading}
              dataSource={dashboardList}
              onPreview={handlePreview}
              onIframePreview={handleIframePreview}
              onEdit={handleEdit}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

export default Home;

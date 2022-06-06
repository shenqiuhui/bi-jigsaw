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
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
}

const { Panel } = Collapse;

const Home = () => {
  const history = useHistory();

  const [mode, setMode] = useState('card');
  const [spaceList, setSpaceList] = useState<ISpaceItem[]>([]);
  const [spaceId, setSpaceId] = useState('');
  const [dashboardList, setDashboardList] = useState<IDashboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const spaceOptions = useMemo<IOption[]>(() => spaceList?.map(({ spaceId, spaceName }) => ({
    value: spaceId,
    label: spaceName
  })), [spaceList]);

  const fetchSpaceList = async () => {
    try {
      const res: any = await getSpaceList();

      setSpaceList(res);
      setSpaceId(res?.[0]?.spaceId);
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

  const handlePreview = () => {
    history.push('/preview/20398/1');
    // window.open(`${window.location.pathname}#/preview/${item?.id}`);
  }

  const handleIframePreview = () => {
    history.push('/iframe/20398/1');
  }

  const handleEdit = () => {
    history.push('/editor/20398/1');
    // window.open(`${window.location.pathname}#/editor/${item?.id}`);
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
        <Button type="link" onClick={handleEdit}>
          编辑器 ~/editor/:spaceId/:pageId
        </Button>
        <br />
        <Button type="link" onClick={handlePreview}>
          预览 ~/preview/:spaceId/:pageId
        </Button>
        <br />
        <Button type="link" onClick={handleIframePreview}>
          iframe嵌入 ~/preview/iframe/:spaceId/:pageId
        </Button>
      </Panel>
    </Collapse>
  );

  useUpdateEffect(() => {
    fetchDashboardList();
  }, [spaceId]);

  useEffect(() => {
    fetchSpaceList();
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
          <div className="list-container">
            {mode === 'card' && (
              <CustomCard
                loading={loading}
                dataSource={dashboardList}
              />
            )}
            {mode === 'list' && (
              <CustomList
                loading={loading}
                dataSource={dashboardList}
              />
            )}
          </div>
        </div>

      </Card>
    </div>
  );
}

export default Home;

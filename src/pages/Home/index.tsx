import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { debounce } from 'lodash';
import { Card, Button, Select, Input, Collapse, Radio, RadioChangeEvent } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import { getSpaceList, getDashboardList } from '@/service/apis/home';
import { OptionType } from '@/core/render-engine';
import CustomCard from './components/CustomCard';
import CustomList from './components/CustomList';

import './index.less';

interface SpaceType {
  spaceId: string;
  spaceName: string;
}

export interface DashboardType {
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
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('card');
  const [spaceList, setSpaceList] = useState<SpaceType[]>([]);
  const [spaceId, setSpaceId] = useState('all');
  const [dashboardList, setDashboardList] = useState<DashboardType[]>([]);
  const [dataSource, setDataSource] = useState<DashboardType[]>([]);
  const [loading, setLoading] = useState(false);

  const spaceOptions = useMemo<OptionType[]>(() => spaceList?.reduce((memo, { spaceId, spaceName }) => (memo.push({
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
      setDataSource(res);
    } catch (err) {}

    setLoading(false);
  }

  // 过滤函数
  const dashboardListFilter = (keyword: string, list: DashboardType[]) => {
    const filterList = list?.filter((dashboard) => dashboard?.name?.includes(keyword));
    setDataSource(filterList);
    setLoading(false);
  }

  const dashboardListFilterDebounce = useCallback(debounce(dashboardListFilter, 300), []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value?.trim();
    setKeyword(value);
    setLoading(true);
    dashboardListFilterDebounce(value, dashboardList);
  }

  const handleModeChange = (event: RadioChangeEvent) => {
    setMode(event?.target?.value);
  }

  const handleSpaceChange = (value: string) => {
    setSpaceId(value);
    setKeyword('');
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

  const titleRender = () => (
    <div className="title-container">
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
      <div className="search-input-wrapper">
        <Input
          className="search-input"
          placeholder="请输入关键字"
          value={keyword}
          allowClear
          suffix={<SearchOutlined className="search-input-icon" />}
          onChange={handleSearch}
        />
      </div>
    </div>
  );

  const layoutControllerRender = () => (
    <div className="layout-controller">
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
    </div>
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

  const highlightRender = (text: string) => {
    const index = text?.indexOf(keyword);
    const beforeStr = text?.substring(0, index);
    const afterStr = text?.slice(index + keyword?.length);

    return keyword && index > -1 ? (
      <span>
        {beforeStr}
        <span className="keyword-highlight">
          {keyword}
        </span>
        {afterStr}
      </span>
    ) : text;
  }

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
        title={titleRender()}
        extra={layoutControllerRender()}
      >
        <div className="list-wrapper">
          <div className="tips">
            {tipsRender()}
          </div>
          {mode === 'card' && (
            <CustomCard
              loading={loading}
              dataSource={dataSource}
              highlightRender={highlightRender}
              onPreview={handlePreview}
              onIframePreview={handleIframePreview}
              onEdit={handleEdit}
            />
          )}
          {mode === 'list' && (
            <CustomList
              loading={loading}
              dataSource={dataSource}
              highlightRender={highlightRender}
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

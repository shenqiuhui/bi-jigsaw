import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Divider, Space, Button, Modal, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { cloneDeep, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import logo from '@/assets/dashboard-logo.png';
import { setDashboardConfig, setDashboardStatus } from '@/store/slices/dashboardSlice';
import { IRootState } from '@/store/types';
import { ICoordinate, IWidget, ITabs } from '@/store/types';
import { IPlanData } from '@/pages/Editer/types';
import { widgetMap, widgetButtons, widgetConfig } from '@/pages/Editer/register';
import { getPageConfig, setPageConfig, getPlanList } from '@/service/dashboardApi';

import './index.less';

const { Header, Content } = Layout;

const activeButtons = [
  { type: 'edit', name: '编辑' },
  { type: 'preview', name: '预览' },
]

interface IRouteParams {
  id: string;
};

const DashboardLayout: React.FC<RouteConfigComponentProps<any>> = (props) => {
  const { route } = props;

  const { id: pageId } = useParams<IRouteParams>();
  const [activeButtonValue, setActiveButtonValue] = useState('edit');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [defaultPlan, setDefaultPlan] = useState<IPlanData>({} as IPlanData);

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: IRootState) => state.dashboard);

  const { pageConfig } = dashboardState;

  // 过滤器 uuid 集合，用于重复检测
  const uuidMaps = useMemo(() => {
    return pageConfig?.widgets?.map((item) => item.id) || [];
  }, [pageConfig?.widgets]);

  // 更改保存状态
  const deleteNewWidgetStatus = (widgetSource: IWidget[]) => {
    const widgets = cloneDeep(widgetSource);

    for (let i = 0; i < widgets?.length; i++) {
      const outterWidget: IWidget = widgets[i];
      const tabs = outterWidget?.tabs || [];

      if (outterWidget?.type === 'tabs' && tabs?.length > 0) {
        for (let j = 0; j < tabs?.length; j++) {
          const tab = tabs[j];

          if (tab?.widgets && tab?.widgets?.length > 0) {
            deleteNewWidgetStatus(tab?.widgets);
          }
        }
      } else {
        if (outterWidget?.newWidget) {
          delete outterWidget?.newWidget;
        }
      }
    }

    return widgets;
  }

  // 计算新增组件坐标
  const computedCoordinate = (id: string, type: string, widgets: IWidget[]) => {
    const coordinate = {
      i: id,
      x: 0,
      y: 0,
      w: widgetMap?.[type]?.defaultW,
      h: widgetMap?.[type]?.defaultH
    } as ICoordinate;

    let maxY = 0;
    let maxH = 0;
    let curX = 0;
    let curW = 0;
    let curY = 0;
    let curH = 0;

    for (let i = 0; i < widgets.length; i++) {
      const { x, y, w, h } = widgets[i].coordinate;

      if (maxY === y) {
        maxH = maxH < h ? h : maxH;
        coordinate.y = y + maxH;
      } else if (maxY < y) {
        maxY = y;
        coordinate.y = y + h;
      }

      curX = x;
      curW = w;
      curY = y;
      curH = h;
    }

    if ((curX >= coordinate.w || 12 - (curX + curW) < coordinate.w) && curY + curH >= coordinate.y) {
      coordinate.x = 0;
    } else {
      coordinate.x = curX + curW;
    }

    return coordinate;
  }

  // 添加组件
  const handleAddWidget = (type: string) => {
    const uuid = uuidv4();

    if (uuidMaps?.includes(uuid)) {
      handleAddWidget(type);
    } else {
      const widgets = cloneDeep(pageConfig?.widgets || []);
      const coordinate = computedCoordinate(uuid, type, widgets);

      if (type !== 'tabs') {
        if (isEmpty(defaultPlan)) {
          return message.error('请先去数据查询平台创建查询条件并设置为自动更新，再创建图表组件');
        }

        widgets?.push({
          newWidget: true,
          id: uuid,
          coordinate,
          ...widgetConfig?.[type],
          settings: {
            ...widgetConfig?.[type]?.settings,
            data: {
              ...widgetConfig?.[type]?.settings?.data,
              planId: defaultPlan?.planId,
              planName: defaultPlan?.planName
            }
          }
        });
      } else {
        const tabsInStyle = widgetConfig?.[type]?.settings?.style?.tabs?.map((tab) => {
          const key = uuidv4();
          return { ...tab, key };
        });

        const tabsInWidget = tabsInStyle?.map((tab) => ({ ...tab, widgets: []}));

        widgets?.push({
          id: uuid,
          coordinate,
          ...widgetConfig?.[type],
          tabs: tabsInWidget as ITabs[],
          settings: {
            style: {
              ...widgetConfig?.[type]?.settings?.style,
              tabs: tabsInStyle as ITabs[]
            }
          }
        });
      }

      dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    }
  }

  // 切换状态
  const handleEidterStatusChange = (type: string) => {
    setActiveButtonValue(type);
    dispatch(setDashboardStatus(type));
  }

  // 保存配置
  const handleSaveConfig = async () => {
    setSaveLoading(true);

    try {
      await setPageConfig({ ...pageConfig, widgets: deleteNewWidgetStatus(pageConfig?.widgets) });
      message.success('保存成功');

      const res: any = await getPageConfig({
        pageId
      });

      dispatch(setDashboardConfig(res));
    } catch (err) {}

    setSaveLoading(false);
  }

  // 退出编辑页面
  const handleExitLayout = () => {
    const { pathname } = window.location;

    Modal.confirm({
      title: '提示',
      content: '当前页面存在未保存数据将会丢失，确定退出吗？',
      keyboard: true,
      onOk: () => window.location.replace(`${pathname}#/`)
    });
  }

  // 拉取查询条件数据
  const fetchPlanData = async () => {
    try {
      const res: any = await getPlanList({});

      if (res?.length > 0) {
        setDefaultPlan(res?.[0]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const unloadMessage = '当前页面存在未保存数据将会丢失，确定退出吗？';
    const savedOnBeforeUnload = window.onbeforeunload;

    window.onbeforeunload = function onbeforeunload() {
      return unloadMessage;
    }

    return () => {
      window.onbeforeunload = savedOnBeforeUnload;
    }
  }, []);

  useEffect(() => {
    fetchPlanData();
  }, []);

  return (
    <Layout className="dashborad-layout">
      <Header className="dashborad-header">
        <div className="dashborad-logo">
          <img src={logo} alt="仪表板编辑器" />
        </div>
        <div className="dashborad-header-right">
          <h1 className="dashborad-title ellipsis">
            {pageConfig?.name}
          </h1>
          {activeButtonValue === 'edit' && (
            <ul className="dashborad-tabs">
              {widgetButtons?.map((item) => (
                <li key={item.type} onClick={() => handleAddWidget(item.type)}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
          <div className="dashborad-operater">
            <ul className="switch-buttons">
              {activeButtons?.map(({ type, name }) => (
                <li
                  key={type}
                  className={classNames({
                    active: type === activeButtonValue
                  })}
                  onClick={() => handleEidterStatusChange(type)}
                >
                  {name}
                </li>
              ))}
              <li
                className={classNames({
                  'switch-buttons-mark': true,
                  'edit-buttons-mark': activeButtonValue === 'edit',
                  'preview-buttons-mark': activeButtonValue === 'preview',
                })}
              />
            </ul>
            <Space
              className="dashborad-operater-buttons"
              size={0}
              split={
                <Divider className="divider" type="vertical" />
              }
            >
              <Button
                className="dashborad-operater-button"
                type="link"
                loading={saveLoading}
                onClick={handleSaveConfig}
              >
                保存
              </Button>
              <Button
                className="dashborad-operater-button"
                type="link"
                onClick={handleExitLayout}
              >
                退出
              </Button>
            </Space>
          </div>
        </div>
      </Header>
      <Content className="dashborad-content">
        {renderRoutes(route?.routes)}
      </Content>
    </Layout>
  );
};

export default DashboardLayout;

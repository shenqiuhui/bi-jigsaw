import React, { useState, useEffect, useMemo } from 'react';
import { ConfigProvider, Layout, Button, Modal, Tooltip, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { cloneDeep, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { IconFont } from '@/assets/iconfont';
import { checkDashboardAuth } from '@/service/apis/auth';
import { getPageConfig, setPageConfig, getPlanList } from '@/service/apis/dashboard';
import { useComponent, useConfig, WidgetButtonType } from '@/core/register';
import { AuthHOC, DashboardParamsType, CoordinateType, WidgetType, TabType } from '@/core/render-engine';
import { PlanDataType } from '@/core/component-center/settings'
import { setDashboardConfig, setDashboardStatus } from '@/store/slices/dashboard';
import { RootStateType } from '@/store';

import './index.less';

const { Header, Content } = Layout;

const activeButtons = [
  { type: 'edit', name: '编 辑' },
  { type: 'preview', name: '预 览' },
];

const DashboardLayout: React.FC<RouteConfigComponentProps> = (props) => {
  const { route } = props;

  const dispatch = useDispatch();
  const { pageId } = useParams<DashboardParamsType>();
  const dashboardState = useSelector((state: RootStateType) => state.dashboard);
  const { pageConfig, pageStatus } = dashboardState;

  const [saveLoading, setSaveLoading] = useState(false);
  const [defaultPlan, setDefaultPlan] = useState<PlanDataType>({} as PlanDataType);
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [widgetConfig] = useConfig('widgets');
  const [widgetMap, { generateEnumListByComponent }] = useComponent('widgets');
  const widgetButtons: WidgetButtonType[] = generateEnumListByComponent('widgets', {
    fieldKey: 'type',
    fieldName: 'name'
  });

  // 过滤器 uuid 集合，用于重复检测
  const uuidMaps = useMemo(() => {
    return pageConfig?.widgets?.map((item) => item.id) || [];
  }, [pageConfig?.widgets]);

  // 更改保存状态
  const deleteNewWidgetStatus = (widgetSource: WidgetType[]) => {
    const widgets = cloneDeep(widgetSource);

    for (let i = 0; i < widgets?.length; i++) {
      const outerWidget: WidgetType = widgets[i];
      const tabs = outerWidget?.tabs || [];

      if (outerWidget?.type === 'tabs' && tabs?.length > 0) {
        for (let j = 0; j < tabs?.length; j++) {
          const tab = tabs[j];

          if (tab?.widgets && tab?.widgets?.length > 0) {
            deleteNewWidgetStatus(tab?.widgets);
          }
        }
      } else {
        if (outerWidget?.newWidget) {
          delete outerWidget?.newWidget;
        }
      }
    }

    return widgets;
  }

  // 滚动到最底部
  const scrollToBottom = () => {
    const scrollContainer = document.getElementById('widgets-viewport');

    setTimeout(() => scrollContainer?.scrollTo({
      top: scrollContainer?.scrollHeight,
      behavior: 'smooth'
    }), 0);
  }

  // 计算新增组件坐标
  const computedCoordinate = (id: string, type: string, widgets: WidgetType[]) => {
    const coordinate = {
      i: id,
      x: 0,
      y: 0,
      w: widgetMap?.[type]?.defaultW,
      h: widgetMap?.[type]?.defaultH
    } as CoordinateType;

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
          return messageApi.error('请先去数据查询平台创建查询条件并设置为自动更新，再创建图表组件');
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
        const tabsInStyle = widgetConfig?.[type]?.settings?.style?.tabs?.map((tab: TabType) => {
          const key = uuidv4();
          return { ...tab, key };
        });

        const tabsInWidget = tabsInStyle?.map((tab: TabType) => ({ ...tab, widgets: []}));

        widgets?.push({
          id: uuid,
          coordinate,
          ...widgetConfig?.[type],
          tabs: tabsInWidget as TabType[],
          settings: {
            style: {
              ...widgetConfig?.[type]?.settings?.style,
              tabs: tabsInStyle as TabType[]
            }
          }
        });
      }

      scrollToBottom();
      dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    }
  }

  // 切换状态
  const handleEditorStatusChange = (type: string) => {
    dispatch(setDashboardStatus(type));
  }

  // 保存配置
  const handleSaveConfig = async () => {
    setSaveLoading(true);

    try {
      await setPageConfig({ ...pageConfig, widgets: deleteNewWidgetStatus(pageConfig?.widgets) });
      messageApi.success('保存成功');

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

    modalApi.confirm({
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
    <Layout className="dashboard-layout">
      <Header
        className={classNames({
          'dashboard-header': true,
          'light-theme-dashboard-header': pageConfig?.theme === 'light',
          'dark-theme-dashboard-header': pageConfig?.theme === 'dark',
        })}
      >
        {!isEmpty(pageConfig) && (
          <>
            <div className="dashboard-operator-exit">
              <IconFont
                className="dashboard-operator-exit-icon"
                type="icon-back"
                onClick={handleExitLayout}
              />
            </div>
            <div className="dashboard-header-right">
              <h1 className="dashboard-title ellipsis">
                {pageConfig?.name}
              </h1>
              {pageStatus === 'edit' && (
                <ul className="dashboard-tabs">
                  {widgetButtons?.map((item) => (
                    <Tooltip key={item?.type} title={item?.name}>
                      <li onClick={() => handleAddWidget(item?.type)}>
                        <IconFont
                          className="widget-add-button"
                          type={`icon-widget-${item?.type}`}
                        />
                      </li>
                    </Tooltip>
                  ))}
                </ul>
              )}
              <div className="dashboard-operator">
                <ul
                  className={classNames({
                    'switch-buttons': true,
                    'light-theme-switch-buttons': pageConfig?.theme === 'light',
                    'dark-theme-switch-buttons': pageConfig?.theme === 'dark',
                  })}
                >
                  {activeButtons?.map(({ type, name }) => (
                    <li
                      key={type}
                      className={classNames({
                        active: type === pageStatus
                      })}
                      onClick={() => handleEditorStatusChange(type)}
                    >
                      {name}
                    </li>
                  ))}
                  <li
                    className={classNames({
                      'switch-buttons-mark': true,
                      'edit-buttons-mark': pageStatus === 'edit',
                      'preview-buttons-mark': pageStatus === 'preview',
                    })}
                  />
                </ul>
                <Button
                  className="dashboard-operator-save"
                  type="primary"
                  shape="round"
                  loading={saveLoading}
                  onClick={handleSaveConfig}
                >
                  保存
                </Button>
              </div>
            </div>
          </>
        )}
      </Header>
      <Content className="dashboard-content">
        {renderRoutes(route?.routes)}
      </Content>
      <ConfigProvider prefixCls={pageConfig?.theme}>
        {modalContextHolder}
        {messageContextHolder}
      </ConfigProvider>
    </Layout>
  );
};

export default AuthHOC(DashboardLayout, checkDashboardAuth);

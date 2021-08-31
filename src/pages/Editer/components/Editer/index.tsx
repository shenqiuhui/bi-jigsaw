import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Spin } from 'antd';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { pick, cloneDeep } from 'lodash';
import classNames from 'classnames';
import { IRootState } from '@/store/types';
import { getPageConfig } from '@/service/dashboardApi';
import { setDashboardConfig } from '@/store/slices/dashboardSlice';
import { renderEngine } from '@/pages/Editer';
import { Settings, IPageSetting, IWidget, ITabs, IPageConfig } from '@/store/types';
import Setter from '../Setter';
import { IFilterConfig, IGridRef } from '../../types';

import './index.less';

interface IEditerProps {};

interface IRouteParams {
  id: string;
};

const Editer: React.FC<IEditerProps> = memo(() => {
  const { id: pageId } = useParams<IRouteParams>();

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: IRootState) => state.dashboard);

  const { pageConfig, pageStatus } = dashboardState;

  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('page');
  const [settings, setSettings] = useState<Settings>({});
  const [selectedWidgetId, setSelectWidgetId] = useState<string | null>(null);

  const renderEngineRef = useRef<IGridRef>(null);

  const handleFilterConfigSubmit = (data: IFilterConfig) => {
    fetchPageConfig();
  }

  // 选中图表组件切换设置
  const handleWidgetSelect = (id: string | null, type: string, settings: Settings) => {
    setType(type);
    setSelectWidgetId(id);
    setSettings(settings);
  }

  // 替换组件设置
  const replaceWidgets = (
    id: string,
    settingType: string,
    settings: Settings['data'] | Settings['style'],
    widgetsSource: IWidget[],
  ) => {
    const widgets = cloneDeep(widgetsSource);

    for (let i = 0; i < widgets?.length; i++) {
      const outterWidget: IWidget = widgets[i];
      const tabs = outterWidget?.tabs || [];

      if (outterWidget?.type === 'tabs' && tabs?.length > 0) {
        for (let j = 0; j < tabs?.length; j++) {
          const tab = tabs[j];

          if (tab?.widgets && tab?.widgets?.length > 0) {
            tab.widgets = replaceWidgets(id, settingType, settings, tab?.widgets);
          }
        }
      }

      if (outterWidget.id === id) {
        outterWidget.settings[settingType] = settings;

        // 处理样式设置同步到组件
        if (outterWidget?.type === 'tabs' && settings?.tabs) {
          const settingTabs = settings?.tabs || [];

          const tabsMap = tabs?.reduce((map, tab) => {
            return (map.set(tab.key, tab), map);
          }, new Map<string, ITabs>());

          const settingTabMap = settingTabs?.reduce((map, tab) => {
            return (map.set(tab.key, tab), map);
          }, new Map<string, ITabs>());

          // 处理新增和更新
          for (let m = 0; m < settingTabs?.length; m++) {
            const tab = settingTabs[m];

            if (tabsMap.has(tab?.key)) {
              tabsMap.set(tab?.key, { ...tabsMap.get(tab?.key), ...tab });
            } else {
              tabsMap.set(tab?.key, tab);
            }
          }

          // 处理删除
          for (let n = 0; n < tabs.length; n++) {
            const tab = tabs[n];

            if (!settingTabMap.has(tab.key)) {
              tabsMap.delete(tab.key);
            }
          }

          outterWidget.tabs = Array.from(tabsMap.values());
        }
      }
    }

    return widgets;
  }

  // 用于更新页面配置
  const handlePageSettingChange = (pageSettings: IPageSetting) => {
    dispatch(setDashboardConfig({ ...pageConfig, ...pageSettings }));
    setSettings(pageSettings as unknown as Settings);
  }

  // 用于更新组件数据配置
  const handleDataSettingChange = (dataSettings: Settings['data']) => {
    const widgets = replaceWidgets(selectedWidgetId as string, 'data', dataSettings, pageConfig.widgets);
    console.log('%c 🥤 widgets: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', widgets);
    dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    setSettings((settings) => ({ ...settings, data: dataSettings }));
  }

  // 用于更新组件样式配置
  const handleStyleSettingChange = (styleSettings: Settings['style']) => {
    const widgets = replaceWidgets(selectedWidgetId as string, 'style', styleSettings, pageConfig.widgets);
    dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    setSettings((settings) => ({ ...settings, style: styleSettings }));
  }

  // 更新组件集合
  const handleWidgetsUpdate = (widgets: IWidget[], action: string = 'add', updateData: boolean = true) => {
    if (action === 'delete') {
      handlePageSelected();
    }

    updateData && dispatch(setDashboardConfig({ ...pageConfig, widgets }));
  }

  // 页面配置数据更新
  const handlePageConfigUpdate = (config: IPageConfig) => {
    dispatch(setDashboardConfig(config));
  }

  // 选中页面设置
  const handlePageSelected = () => {
    handleWidgetSelect(null, 'page', pick(pageConfig, ['name', 'description', 'theme']) as Settings);
  }

  // 获取页面配置数据
  const fetchPageConfig = useCallback(async () => {
    setLoading(true);

    try {
      const res: any = await getPageConfig({
        pageId
      });

      dispatch(setDashboardConfig(res));
    } catch (err) {}

    setLoading(false);
  }, [dispatch, pageId]);

  useEffect(() => {
    if (!selectedWidgetId) {
      handleWidgetSelect(null, 'page', pick(pageConfig, ['name', 'description', 'theme']) as Settings);
    }
  }, [pageConfig, selectedWidgetId]);

  useEffect(() => {
    fetchPageConfig();
  }, [fetchPageConfig]);

  return (
    <Spin
      wrapperClassName="editer-container-loading"
      size="large"
      spinning={loading}
    >
      <div className="editer-container">
        {!loading && (
          <>
            <div
              className="editer-board-container"
              onClick={handlePageSelected}
            >
              {renderEngine(pageStatus === 'edit' ? {
                isEdit: true,
                config: pageConfig,
                ref: renderEngineRef,
                selectedWidgetId,
                onFilterConfigSubmit: handleFilterConfigSubmit,
                onWidgetSelect: handleWidgetSelect,
                onWidgetsUpdate: handleWidgetsUpdate,
                onPageConfigUpdate: handlePageConfigUpdate,
                onDataSettingChange: handleDataSettingChange,
                onStyleSettingChange: handleStyleSettingChange,
              } : {
                config: pageConfig,
              })}
            </div>
            {pageStatus === 'edit' && (
              <div
                className={classNames({
                  'editer-setter-container': true,
                  'editer-setter-container-none': pageStatus !== 'edit'
                })}
              >
                <Setter
                  type={type}
                  pageId={pageConfig.pageId}
                  spaceId={pageConfig.spaceId}
                  widgetId={selectedWidgetId}
                  settings={settings}
                  watchHandlers={renderEngineRef?.current?.watchHandlers}
                  onPageSettingChange={handlePageSettingChange}
                  onDataSettingChange={handleDataSettingChange}
                  onStyleSettingChange={handleStyleSettingChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Spin>
  );
});

export default Editer;

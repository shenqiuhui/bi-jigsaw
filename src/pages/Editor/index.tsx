import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { pick, cloneDeep, isEmpty } from 'lodash-es';
import classNames from 'classnames';
import { getPageConfig } from '@/service/apis/dashboard';
import { setDashboardConfig } from '@/store/slices/dashboard';
import {
  renderEngine,
  ThemeWrapper,
  SettingType,
  PageSettingType,
  WidgetType,
  TabType,
  PageConfigType,
  GridRefType,
  DashboardParamsType
} from '@/core/render-engine';
import { RootStateType } from '@/store';
import Setter from './components/Setter';

import './index.less';

interface EditorProps {};

const Editor: React.FC<EditorProps> = memo(() => {
  const { pageId } = useParams<DashboardParamsType>();

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootStateType) => state.dashboard);

  const { pageConfig, pageStatus } = dashboardState;

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('page');
  const [settings, setSettings] = useState<SettingType>({});
  const [selectedWidgetId, setSelectWidgetId] = useState<string | null>(null);

  const renderEngineRef = useRef<GridRefType>(null);

  const handleFilterConfigSubmit = () => {
    return fetchPageConfig();
  }

  // 选中图表组件切换设置
  const handleWidgetSelect = (id: string | null, type: string, settings: SettingType) => {
    setType(type);
    setSelectWidgetId(id);
    setSettings(settings);
  }

  // 替换组件设置
  const replaceWidgets = (
    id: string,
    settingType: string,
    settings: SettingType['data'] | SettingType['style'],
    widgetsSource: WidgetType[],
  ) => {
    const widgets = cloneDeep(widgetsSource);

    for (let i = 0; i < widgets?.length; i++) {
      const outerWidget: WidgetType = widgets[i];
      const tabs = outerWidget?.tabs || [];

      if (outerWidget?.type === 'tabs' && tabs?.length > 0) {
        for (let j = 0; j < tabs?.length; j++) {
          const tab = tabs[j];

          if (tab?.widgets && tab?.widgets?.length > 0) {
            tab.widgets = replaceWidgets(id, settingType, settings, tab?.widgets);
          }
        }
      }

      if (outerWidget.id === id) {
        outerWidget.settings[settingType] = settings;

        // 处理样式设置同步到组件
        if (outerWidget?.type === 'tabs' && settings?.tabs) {
          const settingTabs = settings?.tabs || [];

          const tabsMap = tabs?.reduce((map, tab) => {
            return (map.set(tab.key, tab), map);
          }, new Map<string, TabType>());

          const settingTabMap = settingTabs?.reduce((map, tab) => {
            return (map.set(tab.key, tab), map);
          }, new Map<string, TabType>());

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

          outerWidget.tabs = Array.from(tabsMap.values());
        }
      }
    }

    return widgets;
  }

  // 用于更新页面配置
  const handlePageSettingChange = (pageSettings: PageSettingType) => {
    dispatch(setDashboardConfig({ ...pageConfig, ...pageSettings }));
    setSettings(pageSettings as unknown as SettingType);
  }

  // 用于更新组件数据配置
  const handleDataSettingChange = (dataSettings: SettingType['data']) => {
    const widgets = replaceWidgets(selectedWidgetId as string, 'data', dataSettings, pageConfig.widgets);
    dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    setSettings((settings) => ({ ...settings, data: dataSettings }));
  }

  // 用于更新组件样式配置
  const handleStyleSettingChange = (styleSettings: SettingType['style']) => {
    const widgets = replaceWidgets(selectedWidgetId as string, 'style', styleSettings, pageConfig.widgets);
    dispatch(setDashboardConfig({ ...pageConfig, widgets }));
    setSettings((settings) => ({ ...settings, style: styleSettings }));
  }

  // 更新组件集合
  const handleWidgetsUpdate = (widgets: WidgetType[], action: string = 'add', updateData: boolean = true) => {
    if (action === 'delete') {
      handlePageSelected();
    }

    updateData && dispatch(setDashboardConfig({ ...pageConfig, widgets }));
  }

  // 页面配置数据更新
  const handlePageConfigUpdate = (config: PageConfigType) => {
    dispatch(setDashboardConfig(config));
  }

  // 选中页面设置
  const handlePageSelected = () => {
    handleWidgetSelect(null, 'page', pick(pageConfig, ['name', 'description', 'theme']) as SettingType);
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
      handleWidgetSelect(null, 'page', pick(pageConfig, ['name', 'description', 'theme']) as SettingType);
    }
  }, [pageConfig, selectedWidgetId]);

  useEffect(() => {
    fetchPageConfig();
  }, [fetchPageConfig]);

  return (
    <Spin
      wrapperClassName="editor-container-loading"
      size="large"
      spinning={loading}
    >
      <ThemeWrapper theme={pageConfig?.theme}>
        <div className="editor-container">
          {!loading && (
            <>
              <div
                className="editor-board-container"
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
              {pageStatus === 'edit' && !isEmpty(settings) && (
                <div
                  className={classNames({
                    'editor-setter-container': true,
                    'editor-setter-container-none': pageStatus !== 'edit',
                    'light-theme-editor-setter-container': pageConfig?.theme === 'light',
                    'dark-theme-editor-setter-container': pageConfig?.theme === 'dark'
                  })}
                >
                  <Setter
                    theme={pageConfig?.theme}
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
      </ThemeWrapper>
    </Spin>
  );
});

export default Editor;

import React, { memo, forwardRef, useState, useMemo } from 'react';
import { Tabs } from 'antd';
import { omitBy, isNil, find, cloneDeep } from 'lodash';
import classNames from 'classnames';
import { IPageConfig, IWidget } from '@/store/types';
import CustomTabs from './CustomTabs';
import { IGridRef, ITabsWidgetProps } from '../../../../types';

import './index.less';

const { TabPane } = Tabs;

const TabsWidget = memo(forwardRef<IGridRef, ITabsWidgetProps>((props, ref) => {
  const {
    pageConfig,
    isEdit,
    id,
    tabs,
    filterValues,
    settings,
    allWidgets,
    selectedWidgetId,
    coordinate,
    emptyRender,
    dropdownRender,
    titleRender,
    gridContainerRender,
    onWidgetSelect,
    onWidgetsUpdate,
    onPageConfigUpdate,
    onDataSettingChange,
    onStyleSettingChange,
    onTabsInfoChange
  } = props;

  const [activeKey, setActiveKey] = useState<string>('');

  const currentActiveKey = useMemo(() => {
    if (find(tabs, ['key', activeKey])) {
      return activeKey;
    } else {
      return tabs?.[0]?.key as string;
    }
  }, [tabs, activeKey]);

  // 动态计算当前 Tabs 选中标签内容的真实高度
  const computeMaxHeight = (widgets: IWidget[]) => {
    return widgets?.reduce((height, widget) => {
      if (height < widget?.coordinate?.y + widget?.coordinate?.h) {
        return widget?.coordinate?.y + widget?.coordinate?.h;
      } else {
        return height;
      }
    }, 0);
  }

  // 计算 Tabs 最新组件全集
  const getNewWidgets = (widgets: IWidget[]) => {
    const newWidgets = cloneDeep(allWidgets);
    const maxH = computeMaxHeight(widgets);
    const tabH = maxH === 0 ? (coordinate?.minH as number) : maxH + 3;

    onTabsInfoChange?.(id, currentActiveKey, tabH);

    for (let i = 0; i < newWidgets?.length; i++) {
      const outterWidget: IWidget = newWidgets[i];

      if (id === outterWidget?.id) {
        const tabs = outterWidget?.tabs || [];

        outterWidget.coordinate.h = tabH;

        for (let j = 0; j < tabs?.length; j++) {
          const key = tabs[j]?.key;

          if (key === currentActiveKey) {
            tabs[j].widgets = widgets;
          }
        }
      }
    }

    return newWidgets;
  }

  // 更新组件配置 AOP 函数
  const handleWidgetUpdate = (widgets: IWidget[], action: string = 'add', updateData: boolean = true) => {
    onWidgetsUpdate?.(getNewWidgets(widgets), action, updateData);
  }

  // 更新页面配置 AOP 函数
  const handlePageConfigUpdate = (config: IPageConfig) => {
    onPageConfigUpdate?.({ ...config, widgets: getNewWidgets(config?.widgets)});
  }

  // 自定义 tabs 渲染
  const handleActiveKeyChange = (key: string) => {
    const tabWidgets = find(tabs, ['key', key])?.widgets || [];
    const maxH = computeMaxHeight(tabWidgets);
    const tabH = maxH === 0 ? (coordinate?.minH as number) : maxH + 3;

    setActiveKey(key);
    onTabsInfoChange?.(id, key, tabH);
  }

  // 左侧右侧的扩展内容
  const tabBarExtraContent = omitBy({
    left: titleRender?.(),
    right: dropdownRender?.()
  }, isNil);

  return (
    <div className="tabs-widget-container">
      <Tabs
        className={classNames({
          'tabs-widget': true,
          'tabs-widget-no-title': !tabBarExtraContent?.left
        })}
        activeKey={currentActiveKey as string}
        tabBarExtraContent={tabBarExtraContent}
        renderTabBar={(tabProps) => (
          <CustomTabs
            id={id}
            tabProps={{ ...tabProps, position: settings?.style?.align }}
            onActiveKeyChange={handleActiveKeyChange}
          />
        )}
      >
        {tabs?.map((tab) => (
          <TabPane key={tab?.key} tab={tab?.name}>
            <div
              className={classNames({
                'inner-layout-not-show': !tab?.widgets?.length
              })}
            >
              {gridContainerRender?.({
                inner: true,
                ref,
                pageConfig,
                isEdit,
                widgets: tab?.widgets || [],
                filterValues,
                selectedWidgetId,
                onWidgetSelect,
                onWidgetsUpdate: handleWidgetUpdate,
                onPageConfigUpdate: handlePageConfigUpdate,
                onDataSettingChange,
                onStyleSettingChange
              })}
            </div>
            {!tab?.widgets?.length && emptyRender?.()}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}));

export default TabsWidget;

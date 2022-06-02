import React, { memo, useState, useMemo, useRef, useEffect } from 'react';
import { omit } from 'lodash';
import Register, { widgetSettingMap } from '@/core/register';
import { Settings, IPageSetting } from '@/store/types';
import { ITabsContainerRefs, IWatchHandlers } from '@/types';
import TabsContainer from './TabsContainer';

import './index.less';

interface ISetterProps {
  type: string;
  pageId: number;
  spaceId: string;
  widgetId: string | null;
  settings: Settings;
  watchHandlers?: IWatchHandlers | undefined;
  onPageSettingChange?: (pageSetting: IPageSetting) => void;
  onDataSettingChange?: (dataSettings: Settings['data']) => void;
  onStyleSettingChange?: (styleSettings: Settings['style']) => void;
};

const { hasComponent } = Register;

const Setter: React.FC<ISetterProps> = memo((props) => {
  const {
    type,
    pageId,
    spaceId,
    widgetId,
    settings,
    watchHandlers,
    onPageSettingChange,
    onDataSettingChange,
    onStyleSettingChange
  } = props;

  const [activeTab, setActiveTab] = useState<string>('data');
  const tabsRef = useRef<ITabsContainerRefs>(null);

  const hasTab = useMemo<boolean>(() => {
    return widgetSettingMap?.[type]?.hasTab;
  }, [type]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    tabsRef?.current?.activeKeyInit();
  }, [widgetId]);

  return (
    <div className="setter-container">
      <h2>{widgetSettingMap?.[type]?.name}</h2>
      {hasComponent('settings', type) ? (
        <TabsContainer
          hasTab={hasTab}
          ref={tabsRef}
          onTabChange={handleTabChange}
        >
          {widgetSettingMap?.[type]?.component?.({
            ...omit(widgetSettingMap?.[type], ['component']),
            activeTab: hasTab ? activeTab : null,
            pageId,
            spaceId,
            widgetId,
            settings,
            onPageSettingChange,
            onDataSettingChange,
            onStyleSettingChange,
            onWatchInfoChange: watchHandlers?.[widgetId as string]
          })}
        </TabsContainer>
      ) : (
        <div className="setter-content-empty">
          暂无设置
        </div>
      )}
    </div>
  );
});

export default Setter;

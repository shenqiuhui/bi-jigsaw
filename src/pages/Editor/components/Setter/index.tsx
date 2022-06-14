import { memo, useState, useMemo, useRef, useEffect } from 'react';
import { omit } from 'lodash';
import { useComponent } from '@/core/register';
import { SettingType, PageSettingType, WatchHandlersType } from '@/core/render-engine';
import TabsContainer from './TabsContainer';

import './index.less';
import classNames from 'classnames';

export interface TabsContainerRefType {
  activeKeyInit: () => void;
}

interface SetterProps {
  theme: string;
  type: string;
  pageId: string;
  spaceId: string;
  widgetId: string | null;
  settings: SettingType;
  watchHandlers?: WatchHandlersType | undefined;
  onPageSettingChange?: (pageSetting: PageSettingType) => void;
  onDataSettingChange?: (dataSettings: SettingType['data']) => void;
  onStyleSettingChange?: (styleSettings: SettingType['style']) => void;
};


const Setter: React.FC<SetterProps> = memo((props) => {
  const {
    theme = 'light',
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

  const [widgetSettingMap, { hasComponent }] = useComponent('settings');

  const [activeTab, setActiveTab] = useState('data');
  const tabsRef = useRef<TabsContainerRefType>(null);

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
    <div
      className={classNames({
        'setter-container': true,
        'setter-container-light': theme === 'light',
        'setter-container-dark': theme === 'dark',
      })}
    >
      <h2>
        {widgetSettingMap?.[type]?.name}
      </h2>
      {hasComponent('settings', type) ? (
        <TabsContainer
          hasTab={hasTab}
          ref={tabsRef}
          onTabChange={handleTabChange}
        >
          {widgetSettingMap?.[type]?.component?.({
            ...omit(widgetSettingMap?.[type], ['component']),
            activeTab: hasTab ? activeTab : null,
            theme,
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

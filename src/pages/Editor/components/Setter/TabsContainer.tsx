import { memo, forwardRef, useState, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { TabsContainerRefType } from '@/pages/Editor/components/Setter';

import './index.less';

interface TabsContainerProps {
  hasTab: boolean;
  children?: React.ReactNode;
  onTabChange?: (id: string) => void;
}

const tabs = [
  { key: 'data', name: '数据' },
  { key: 'style', name: '样式'}
];

const TabsContainer = memo(forwardRef<TabsContainerRefType, TabsContainerProps>((props, ref) => {
  const { hasTab = false, children, onTabChange } = props;

  const [activeKey, setActiveKey] = useState('data');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  useImperativeHandle(ref, () => ({
    activeKeyInit: () => handleTabChange('data')
  }));

  return (
    <div className="setter-content">
      {hasTab ? (
        <div className="tabs-container">
          <ul>
            {tabs.map((tab) => (
              <li
                className={classNames({
                  active: activeKey === tab.key
                })}
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div className="tabs-content">
            {children}
          </div>
        </div>
      ) : (
        <div className="setter-content-no-tabs">
          {children}
        </div>
      )}
    </div>
  );
}));

export default TabsContainer;

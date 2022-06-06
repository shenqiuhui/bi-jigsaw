import React, { useState, useLayoutEffect, useCallback } from 'react';
import classNames from 'classnames';

import './index.less';

interface ICustomTabsProps {
  id: string;
  tabProps: any;
  onActiveKeyChange: (key: string) => void;
}

const CustomTabs: React.FC<ICustomTabsProps> = (props) => {
  const { id, tabProps, onActiveKeyChange } = props;
  const { panes, extra, activeKey, position } = tabProps;

  const [curWidth, setCurWidth] = useState<number>();
  const [curOffset, setCurOffset] = useState<number>();
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [isShowLeft, setIsShowLeft] = useState<boolean>(false);
  const [isShowRight, setIsShowRight] = useState<boolean>(true);

  const handleTabChange = useCallback((dom: HTMLElement, key?: string) => {
    key && onActiveKeyChange?.(key);
    setCurWidth(dom?.offsetWidth);
    setCurOffset(dom?.offsetLeft);
  }, [onActiveKeyChange]);

  const handleScroll = (event: any) => {
    const {scrollLeft, clientWidth, scrollWidth} = event.target;
    setIsShowLeft(scrollLeft !== 0);
    setIsShowRight(scrollWidth > scrollLeft + clientWidth);
  }

  useLayoutEffect(() => {
    if (id) {
      const tabItemDom = document.querySelector(`.selector-${id} .tabs-nav-list li.tab-active`) as HTMLElement;
      const tabContainerDom = document.querySelector(`.selector-${id} .tabs-nav-list`) as HTMLElement;
      const tabItemContainerDom = document.querySelector(`.selector-${id} .tabs-nav-list ul`) as HTMLElement;
      setIsScroll(tabItemContainerDom.clientWidth > tabContainerDom.clientWidth);
      handleTabChange(tabItemDom);
    }
  }, [handleTabChange, id]);

  return (
    <div className="tabs-nav">
      <div className="tabs-extra-left">
        {extra?.left}
      </div>
      <div
        className={classNames({
          [`selector-${id}`]: true,
          'tabs-list-nav-container': true,
          'tabs-list-nav-container-left': isScroll && isShowLeft,
          'tabs-list-nav-container-right': isScroll && isShowRight,
        })}
      >
        <div
          className={classNames({
            'tabs-nav-list': true,
            [`tabs-nav-list-${position}`]: !isScroll
          })}
          onScroll={handleScroll}
        >
          <ul>
            {panes?.map((pane: any) => (
              <li
                className={classNames({
                  'tab-active': activeKey === pane.key
                })}
                key={pane?.key}
                onClick={(event) => handleTabChange(event?.currentTarget, pane?.key)}
              >
                {pane?.props?.tab}
              </li>
            ))}
            <div
              className="tabs-ink-bar"
              style={{ width: curWidth as number, left: curOffset as number }}
            />
          </ul>
        </div>
      </div>
      <div className="tabs-extra-right">
        {extra?.right}
      </div>
    </div>
  );
}

export default CustomTabs;

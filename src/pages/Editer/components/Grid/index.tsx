import React, { memo, forwardRef, useState, useMemo, useRef, useImperativeHandle } from 'react';
import GridLayout, { Layout, ItemCallback } from 'react-grid-layout';
import { AutoSizer } from 'react-virtualized';
import { omit, pick, omitBy, isNil, cloneDeep, find } from 'lodash'
import classNames from 'classnames';
import { IPageConfig, IWidget, IFilterForm, Settings } from '@/store/types';
import WidgetContainer from '../WidgetContainer';
import Register, { widgetMap } from '../../register';
import { IGridRef, IWidgetContainerRef, IWatchHandlers } from '../../types';

import './index.less';

export interface IGirdProps {
  ref?: any;
  inner?: boolean;
  pageConfig: IPageConfig;
  isEdit: boolean;
  widgets: IWidget[];
  selectedWidgetId?: string | null | undefined;
  filterValues: IFilterForm | undefined;
  onWidgetSelect?: ((id: string, type: string, settings: Settings) => void) | undefined;
  onWidgetsUpdate?: ((widgets: IWidget[], action?: string, updateData?: boolean) => void) | undefined;
  onPageConfigUpdate?: ((config: IPageConfig) => void) | undefined;
  onDataSettingChange?: ((dataSettings: Settings['data']) => void) | undefined;
  onStyleSettingChange?: ((styleSettings: Settings['style']) => void) | undefined;
}

interface ITabsInfo {
  [key: string]: {
    activeTab: string;
    height: number
  };
}

const sizeInfoKeys = ['minW', 'minH', 'maxW', 'maxH', 'defaultW', 'defaultH',];
const omitKeys = sizeInfoKeys.concat(['component']);
const { hasComponent } = Register;

const Gird = memo(forwardRef<IGridRef, IGirdProps>((props, ref) => {
  const {
    inner = false,
    pageConfig,
    widgets = [],
    isEdit,
    filterValues,
    selectedWidgetId,
    onWidgetSelect,
    onWidgetsUpdate,
    onPageConfigUpdate,
    onDataSettingChange,
    onStyleSettingChange
  } = props;

  const [showMask, setShowMask] = useState<boolean>(false);
  const [pointX, setPointX] = useState<number>(0);
  const [pointY, setPointY] = useState<number>(0);
  const [showWidgets, setShowWidgets] = useState<boolean>(false);
  const [activeTabsInfo, setActiveTabsInfo] = useState<ITabsInfo>({});

  const widgetContainerRef = useRef<IWatchHandlers>({});

  useImperativeHandle(ref, () => ({
    watchHandlers: {
      ...widgetContainerRef?.current,
      ...(ref as React.MutableRefObject<IGridRef>)?.current?.watchHandlers
    }
  }));

  // 已注册的组件
  const existWidgets = useMemo<IWidget[]>(() => {
    return widgets?.filter((widget) => hasComponent('widgets', widget?.type));
  }, [widgets]);

  // 生成 layout 坐标数据
  const layoutInfo = useMemo(() => {
    return existWidgets.map((widget) => {
      return {
        ...widget?.coordinate || {},
        ...omitBy(pick(widgetMap?.[widget?.type], sizeInfoKeys), isNil)
      };
    });
  }, [existWidgets]);

  // 更新 Tabs 信息
  const handleTabsInfoChange = (id: string, activeTab: string, height: number) => {
    setActiveTabsInfo((prevMap) => ({ ...prevMap, [id]: { activeTab, height } }));
  }

  // 构建组件监听事件集合
  const setWatchInfoHandles = (widgetRef: IWidgetContainerRef) => {
    if (widgetRef?.widgetId && widgetRef?.handler) {
      const { widgetId, handler } = widgetRef;
      widgetContainerRef.current[widgetId] = handler;
    }
  }

  // 勾股定理计算斜边距离
  const getHypotenuse = (oldX: number, oldY: number, newX: number, newY: number) => {
    return Math.sqrt((oldX - newX) ** 2 + (oldY - newY) ** 2);
  }

  // 选中组件
  const handleWidgetSelect = (id: string, type: string, settings: Settings) => {
    onWidgetSelect?.(id, type, settings);
  }

  // 拖拽坐标变化
  const handleLayoutChange = (layout: Layout[]) => {
    const newWidgets = cloneDeep(widgets).map((widget, index) => {
      if (widget?.id === layout?.[index]?.i) {
        const tabWidgets = find(widget?.tabs, ['key', activeTabsInfo?.[widget?.id]?.activeTab])?.widgets || [];

        if (widget?.type === 'tabs' && tabWidgets?.length) {
          return { ...widget, coordinate: { ...layout?.[index], h: activeTabsInfo?.[widget?.id]?.height } };
        } else {
          return { ...widget, coordinate: layout?.[index] };
        }
      } else {
        return widget;
      }
    })?.sort((prev, next) => {
      return prev?.coordinate?.y === next?.coordinate?.y
        ? prev?.coordinate?.x - next?.coordinate?.x
        : prev?.coordinate?.y - next?.coordinate?.y;
    });

    onWidgetsUpdate?.(newWidgets);
    setShowWidgets(true);
  }

  // 删除组件
  const hanleWidgetDelete = (id: string) => {
    const newWidgets = cloneDeep(widgets).filter((widget) => id !== widget?.id);
    const newConditions = cloneDeep(pageConfig?.filters?.conditions)?.map((condition) => {
      const { checkedWidgets, widgetFieldList } = condition;

      return {
        ...condition,
        checkedWidgets: checkedWidgets?.filter((widgetId) => widgetId !== id) || [],
        widgetFieldList: widgetFieldList?.filter((widgetFieldInfo) => widgetFieldInfo?.widgetId !== id) || []
      };
    });

    onWidgetsUpdate?.(newWidgets, 'delete', false);
    onPageConfigUpdate?.({
      ...pageConfig,
      filters: {
        ...pageConfig?.filters,
        conditions: newConditions
      },
      widgets: newWidgets,
    });
  }

  // 开始拖拽记录点击坐标
  const handleDragStart: ItemCallback = (_layout, _oldItem, _newItem, _placeholder, event) => {
    event?.stopPropagation();
    setPointX(event.clientX);
    setPointY(event.clientY);
  }

  // 拖拽中计算抖动幅度决定触发的事件
  const handleDrag: ItemCallback = (_layout, _oldItem, _newItem, _placeholder, event) => {
    const hypotenuse = getHypotenuse(pointX, pointY, event.clientX, event.clientY);

    if (hypotenuse >= 7 && !showMask) {
      setShowMask(true);
    }
  }

  // 拖拽结束组件恢复可点击状态
  const handleDragStop: ItemCallback = () => {
    showMask && setShowMask(false);
  }

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <GridLayout
          className="grid-container"
          width={width}
          layout={layoutInfo}
          cols={12}
          rowHeight={10}
          isDraggable={isEdit}
          isResizable={isEdit}
          isBounded
          onLayoutChange={handleLayoutChange}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragStop={handleDragStop}
        >
          {existWidgets?.map((widget) => {
            const otherProps = omit(widgetMap?.[widget?.type], omitKeys);

            const widgetContainerProps = isEdit ? {
              inner,
              selectedWidgetId,
              showOperater: true,
              ref: setWatchInfoHandles,
              onWidgetSelect: handleWidgetSelect,
              onWidgetDelete: hanleWidgetDelete
            } : {};

            const tabsContainerProps = widget?.type === 'tabs' ? {
              ref,
              pageConfig,
              allWidgets: existWidgets,
              selectedWidgetId,
              onWidgetSelect,
              onWidgetsUpdate,
              onPageConfigUpdate,
              onTabsInfoChange: handleTabsInfoChange
            } : {};

            return (
              <div
                className={classNames({
                  'selected-widget': isEdit && selectedWidgetId === widget?.id,
                  'hover-widget': isEdit && selectedWidgetId !== widget?.id,
                  'inner-widget': widget?.parentId
                })}
                key={widget?.id}
              >
                {showMask && (
                  <div className="mask" />
                )}
                <WidgetContainer
                  data={widget}
                  showHeader={otherProps?.showHeader as boolean}
                  form={filterValues}
                  {...widgetContainerProps}
                >
                  {({ ref, ...otherContainerProps }) => {
                    const containerProps = otherProps?.hasRef ? { ref } : {};

                    return showWidgets && widgetMap?.[widget?.type]?.component?.({
                      isEdit,
                      pageId: pageConfig?.pageId,
                      filterValues,
                      ...widget,
                      ...otherProps,
                      ...containerProps,
                      ...otherContainerProps,
                      ...tabsContainerProps,
                      onDataSettingChange,
                      onStyleSettingChange
                    });
                  }}
                </WidgetContainer>
              </div>
            );
          })}
        </GridLayout>
      )}
    </AutoSizer>
  );
}));

export default Gird;

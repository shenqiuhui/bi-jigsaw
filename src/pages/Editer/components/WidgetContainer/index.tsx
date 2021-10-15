import React, { memo, forwardRef, useState, useRef, useEffect, useMemo, useCallback, useImperativeHandle } from 'react';
import { Menu, Dropdown, Spin } from 'antd';
import {
  MoreOutlined,
  SettingOutlined,
  DeleteOutlined,
  // LogoutOutlined,
  SyncOutlined,
  DownloadOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import classNames from 'classnames';
import { IWidget, Settings, IFilterForm } from '@/store/types';
import Grid, { IGirdProps } from '../Grid';
import { IWidgetRef, IWidgetContainerRef, IGridRef } from '../../types';
import { widgetEmptyMap } from '../../register'

import './index.less';

interface IChildrenProps {
  ref: React.MutableRefObject<IWidgetRef | null>,
  emptyRender: (offset?: number) => React.ReactNode;
  onWatchInfoChange: (info: any) => void;
}

interface ISubGridProps extends IGirdProps {
  ref: React.MutableRefObject<IGridRef>,
}

interface IWidgetContainerProps {
  inner?: boolean;
  showOperater?: boolean;
  showHeader?: boolean;
  selectedWidgetId?: string | null | undefined;
  data: IWidget;
  form?: IFilterForm | undefined;
  children?: (containerProps: IChildrenProps) => React.ReactNode;
  onWidgetSelect?: (id: string, type: string, settings: Settings) => void;
  onWidgetDelete?: (id: string) => void;
}

const { Item } = Menu;

const WidgetContainer = memo(forwardRef<IWidgetContainerRef, IWidgetContainerProps>((props, ref) => {
  const {
    inner,
    data,
    form,
    selectedWidgetId,
    showOperater = false,
    showHeader = true,
    children,
    onWidgetSelect,
    onWidgetDelete
  } = props;

  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [exportDisabled, setExportDisabled] = useState<boolean>(false);
  const [watchInfo, setWatchInfo] = useState<any>();
  const widgetRef = useRef<IWidgetRef>(null);
  const firstRenderRef = useRef<boolean>(true);

  useImperativeHandle(ref, () => ({
    widgetId: data?.id,
    handler: handleWatchInfoChange,
  }));

  // 监听信息变更
  const handleWatchInfoChange = (info: any) => {
    setWatchInfo(info);
  }

  // 阻止事件冒泡
  const handleStopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  }

  // 选中组件
  const handleWidgetSelect = useCallback((event) => {
    handleStopPropagation(event);
    onWidgetSelect?.(data?.id, data?.type, data?.settings);
  }, [data, onWidgetSelect]);

  // 删除组件
  const handleWidgetDelete = useCallback(() => {
    onWidgetDelete?.(data?.id);
  }, [data, onWidgetDelete]);

  // 导出数据
  const handleExportData = useCallback(() => {
    widgetRef?.current?.exportData?.(setExportDisabled, data?.settings);
  }, [data?.settings]);

  // 导出图片
  const handleDownloadImage = () => {
    widgetRef?.current?.downloadImage?.();
  }

  // 点击菜单选项
  const handleMenuItemClick = useCallback(({ key, domEvent }: any) => {
    handleStopPropagation(domEvent);
    switch (key) {
      case 'setting':
        return handleWidgetSelect(domEvent);
      case 'move':
        return;
      case 'export':
        return handleExportData();
      case 'download':
        return handleDownloadImage();
      case 'delete':
        return handleWidgetDelete();
    }
  }, [handleExportData, handleWidgetDelete, handleWidgetSelect]);

  // 刷新数据
  const handleRefresh = (event: React.MouseEvent) => {
    handleStopPropagation(event);
    !data?.newWidget && widgetRef?.current?.fetchData?.(setLoading, data?.settings);
  }

  // 键盘删除操作
  const handleKeyUpDelete = (event: React.KeyboardEvent) => {
    event?.stopPropagation();
    if (['Backspace', 'Delete'].includes(event?.code)) {
      handleWidgetDelete();
    }
  }

  // 渲染组件空数据方法
  const emptyRender = (offset?: number) => {
    offset && setOffset(offset);
    return widgetEmptyMap?.[data.type]?.component();
  }

  // 操作菜单
  const menu = useMemo(() => (
    <Menu theme="light" onClick={handleMenuItemClick}>
      {showOperater && (
        <Item key="setting" icon={<SettingOutlined />} >
          设置
        </Item>
      )}
      {data?.type !== 'tabs' && (
        <>
          {/* {showOperater && (
            <Item key="move" icon={<LogoutOutlined />} >
              移动
            </Item>
          )} */}
          {!showOperater && (
            <Item key="export" disabled={exportDisabled} icon={<DownloadOutlined />} >
              导出数据
            </Item>
          )}
        </>
      )}
      {!['tabs', 'table'].includes(data?.type) && !showOperater &&  (
        <Item key="download" icon={<FileImageOutlined />} >
          导出图片
        </Item>
      )}
      {showOperater && (
        <Item key="delete" icon={<DeleteOutlined />}>
          删除
        </Item>
      )}
    </Menu>
  ), [data?.type, exportDisabled, handleMenuItemClick, showOperater]);

  // 渲染标题
  const titleRender = () => {
    return data?.settings?.style?.showTitle ? (
      <h2 className="widget-title">
        {data?.settings?.style?.title}
      </h2>
    ) : null;
  }

  // 渲染刷新按钮
  const refreshRender = () => (
    <SyncOutlined
      className="widget-operate-sync"
      onClick={handleRefresh}
    />
  );

  // 渲染下拉操作集合
  const dropdownRender = () => (
    <Dropdown
      overlay={menu}
      placement="bottomCenter"
      trigger={['click']}
      overlayClassName="widget-operate-dropdown"
    >
      <MoreOutlined
        className="widget-operate-more"
        onClick={handleStopPropagation}
      />
    </Dropdown>
  );
  // 栅格容器渲染
  const gridContainerRender = (gridProps: ISubGridProps) => {
    const { ref, ...otherProps } = gridProps;
    return (
      <Grid ref={ref} {...otherProps} />
    );
  }

  useEffect(() => {
    if (selectedWidgetId === data?.id) {
      onWidgetSelect?.(selectedWidgetId, data?.type, data?.settings);
    }
  }, [data, onWidgetSelect, selectedWidgetId]);

  useEffect(() => {
    if (form && !data?.newWidget) {
      widgetRef?.current?.fetchData?.(setLoading, data?.settings);
      firstRenderRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.newWidget, form, ...inner ? [widgetRef?.current] : []]);

  useEffect(() => {
    if (firstRenderRef.current || data?.newWidget) return;
    widgetRef?.current?.fetchData?.(setLoading, data?.settings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.newWidget, watchInfo]);

  return (
    <div
      className="widget-container"
      tabIndex={-1}
      onClick={handleWidgetSelect}
      onKeyUp={handleKeyUpDelete}
    >
      {showHeader && (
        <div
          className={classNames({
            'widget-header': true,
            'widget-header-flex-end': !data?.settings?.style?.showTitle
          })}
        >
          {titleRender()}
          <div className="widget-operate">
            <div className="widget-operate-refresh">
              {refreshRender()}
            </div>
            {dropdownRender()}
          </div>
        </div>
      )}
      <div
        className="widget-content"
        style={{ height: `calc(100% - ${showHeader ? 41 : offset}px)`}}
      >
        <Spin spinning={loading}>
          {children?.({
            ref: widgetRef,
            emptyRender,
            onWatchInfoChange: handleWatchInfoChange,
            ...!showHeader ? { titleRender, refreshRender, dropdownRender } : {},
            ...data?.type === 'tabs' ? { gridContainerRender } : {}
          })}
        </Spin>
      </div>
    </div>
  );
}));

export default WidgetContainer;

import { memo, forwardRef, useState, useRef, useMemo, useCallback, useImperativeHandle } from 'react';
import { Menu, Dropdown, Spin, Space } from 'antd';
import {
  MoreOutlined,
  SettingOutlined,
  DeleteOutlined,
  // LogoutOutlined,
  SyncOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import { useFullscreen, useUpdateEffect } from 'ahooks';
import { useInView } from 'react-intersection-observer';
import { throttle } from 'lodash';
import classNames from 'classnames';
import { useComponent } from '@/core/register';
import Grid from '../Grid';
import {
  GridRefType,
  WidgetMethodsType,
  FilterFormType,
  WidgetContainerRefType,
  WidgetType,
  SettingType,
  GirdProps
} from '../../types';

import './index.less';

interface ChildrenProps {
  methodsRegister: (methods: WidgetMethodsType) => void;
  emptyRender: (offset?: number) => React.ReactNode;
  onWatchInfoChange: (info: any) => void;
}

interface SubGridProps extends GirdProps {
  ref: React.MutableRefObject<GridRefType>,
}

interface WidgetContainerProps {
  inner?: boolean;
  showOperator?: boolean;
  showHeader?: boolean;
  useLoading?: boolean;
  selectedWidgetId?: string | null | undefined;
  data: WidgetType;
  form: FilterFormType;
  children?: (containerProps: ChildrenProps) => React.ReactNode;
  onWidgetSelect?: (id: string, type: string, settings: SettingType) => void;
  onWidgetDelete?: (id: string) => void;
}

const { Item } = Menu;

const WidgetContainer = memo(forwardRef<WidgetContainerRefType, WidgetContainerProps>((props, ref) => {
  const {
    data,
    form,
    selectedWidgetId,
    showOperator = false,
    showHeader = true,
    useLoading = true,
    children,
    onWidgetSelect,
    onWidgetDelete
  } = props;

  const [widgetEmptyMap] = useComponent('emptys');

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportDisabled, setExportDisabled] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [watchInfo, setWatchInfo] = useState();
  const [methods, setMethods] = useState<WidgetMethodsType>({});
  const [skip, setSkip] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const widgetScreenRef = useRef<HTMLDivElement>();

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(widgetScreenRef);
  const [inViewRef, inView] = useInView({
    skip,
    root: document.getElementById('widgets-viewport')
  });

  const setRefs = useCallback((node) => {
    widgetScreenRef.current = node;
    inViewRef(node);
  }, [inViewRef]);

  useImperativeHandle(ref, () => ({
    widgetId: data?.id,
    handler: handleWatchInfoChange,
  }));

  // 注册请求方法
  const handleMethodsRegister = (methods: WidgetMethodsType) => {
    setMethods(methods);
  }

  // 监听信息变更
  const handleWatchInfoChange = (info: any) => {
    setWatchInfo(info);
  }

  // 阻止事件冒泡
  const handleStopPropagation = (event: React.MouseEvent) => {
    event?.stopPropagation();
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
  const handleExportData = (data: WidgetType) => {
    setExportDisabled(true);
    methods?.exportData?.(form, data?.settings, watchInfo)?.finally(() => {
      setExportDisabled(false);
    });
  }

  const handleExportDataThrottle = useCallback(throttle(handleExportData, 600), [handleExportData]);

  // 导出图片
  const handleDownloadImage = () => {
    methods?.downloadImage?.(form, watchInfo);
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
        return handleExportDataThrottle(data);
      case 'download':
        return handleDownloadImage();
      case 'delete':
        return handleWidgetDelete();
    }
  }, [data, handleExportDataThrottle, handleWidgetDelete, handleWidgetSelect]);

  // 获取数据逻辑
  const fetchWidgetAction = () => {
    useLoading && setLoading(true);
    setRefreshDisabled(true);
    methods?.fetchData?.(form, data?.settings, watchInfo).finally(() => {
      useLoading && setLoading(false);
      setRefreshDisabled(false);
    });
  }

  // 刷新数据
  const handleRefresh = (event: React.MouseEvent, data: WidgetType) => {
    handleStopPropagation(event);

    if (!data?.newWidget && !refreshDisabled) {
      fetchWidgetAction();
    }
  }

  const handleRefreshThrottle = useCallback(throttle(handleRefresh, 600), [handleRefresh]);

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
      {showOperator && (
        <Item key="setting" icon={<SettingOutlined />} >
          设置
        </Item>
      )}
      {data?.type !== 'tabs' && (
        <>
          {/* {showOperator && (
            <Item key="move" icon={<LogoutOutlined />} >
              移动
            </Item>
          )} */}
          {!showOperator && (
            <Item key="export" disabled={exportDisabled} icon={<DownloadOutlined />} >
              导出数据
            </Item>
          )}
        </>
      )}
      {!['tabs', 'table'].includes(data?.type) && !showOperator &&  (
        <Item key="download" icon={<FileImageOutlined />} >
          导出图片
        </Item>
      )}
      {showOperator && (
        <Item key="delete" icon={<DeleteOutlined />}>
          删除
        </Item>
      )}
    </Menu>
  ), [data?.type, exportDisabled, handleMenuItemClick, showOperator]);

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
    <div className="widget-operate-refresh">
      <SyncOutlined
        className={classNames({
          'widget-operate-base': true,
          'disabled-events': data?.newWidget || refreshDisabled
        })}
        onClick={(event) => {
          handleRefreshThrottle(event, data);
        }}
      />
    </div>
  );

  // 渲染全屏操作
  const toggleScreenRender = () => (
    <div className="widget-operate-toggle-screen">
      {isFullscreen ? (
        <FullscreenExitOutlined
          className="widget-operate-base"
          onClick={toggleFullscreen}
        />
      ) : (
        <FullscreenOutlined
          className="widget-operate-base"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );

  // 渲染下拉操作集合
  const dropdownRender = () => !isFullscreen && (
    <div className="widget-operate-dropdown">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        overlayClassName="widget-operate-dropdown-list"
      >
        <MoreOutlined
          className="widget-operate-more"
          onClick={handleStopPropagation}
        />
      </Dropdown>
    </div>
  );

  // 栅格容器渲染
  const gridContainerRender = (gridProps: SubGridProps) => {
    const { ref, ...otherProps } = gridProps;
    return (
      <Grid ref={ref} {...otherProps} />
    );
  }

  useUpdateEffect(() => {
    if (selectedWidgetId === data?.id) {
      onWidgetSelect?.(selectedWidgetId, data?.type, data?.settings);
    }
  }, [data, selectedWidgetId]);

  useUpdateEffect(() => {
    setLoaded(false);
    setSkip(false);
  }, [form]);

  useUpdateEffect(() => {
    fetchWidgetAction();
  }, [watchInfo]);

  useUpdateEffect(() => {
    if (!data?.newWidget && !loaded && inView) {
      setLoaded(true);
      fetchWidgetAction();
    }

    if (loaded && !inView) {
      setSkip(true);
    }
  }, [methods, loaded, inView, data?.newWidget]);

  return (
    <div
      className="widget-container"
      tabIndex={-1}
      ref={setRefs}
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
          <Space className="widget-operate" size={8}>
            {refreshRender()}
            {toggleScreenRender()}
            {dropdownRender()}
          </Space>
        </div>
      )}
      <div
        className="widget-content"
        style={{ height: `calc(100% - ${showHeader ? 41 : offset}px)`}}
      >
        <Spin spinning={loading}>
          {children?.({
            emptyRender,
            methodsRegister: handleMethodsRegister,
            onWatchInfoChange: handleWatchInfoChange,
            ...!showHeader ? {
              titleRender,
              refreshRender,
              toggleScreenRender,
              dropdownRender
            } : {},
            ...data?.type === 'tabs' ? { gridContainerRender } : {}
          })}
        </Spin>
      </div>
    </div>
  );
}));

export default WidgetContainer;

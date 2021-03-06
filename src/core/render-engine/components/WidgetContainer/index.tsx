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
  theme?: string;
  methodsRegister: (methods: WidgetMethodsType) => void;
  emptyRender: (offset?: number) => React.ReactNode;
  onWatchInfoChange: (info: any) => void;
}

interface SubGridProps extends GirdProps {
  ref: React.MutableRefObject<GridRefType>,
}

interface WidgetContainerProps {
  inner?: boolean;
  theme?: string;
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
    theme = 'light',
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

  // ??????????????????
  const handleMethodsRegister = (methods: WidgetMethodsType) => {
    setMethods(methods);
  }

  // ??????????????????
  const handleWatchInfoChange = (info: any) => {
    setWatchInfo(info);
  }

  // ??????????????????
  const handleStopPropagation = (event: React.MouseEvent) => {
    event?.stopPropagation();
  }

  // ????????????
  const handleWidgetSelect = useCallback((event) => {
    handleStopPropagation(event);
    onWidgetSelect?.(data?.id, data?.type, data?.settings);
  }, [data, onWidgetSelect]);

  // ????????????
  const handleWidgetDelete = useCallback(() => {
    onWidgetDelete?.(data?.id);
  }, [data, onWidgetDelete]);

  // ????????????
  const handleExportData = (data: WidgetType) => {
    setExportDisabled(true);
    methods?.exportData?.(form, data?.settings, watchInfo)?.finally(() => {
      setExportDisabled(false);
    });
  }

  const handleExportDataThrottle = useCallback(throttle(handleExportData, 600), [handleExportData]);

  // ????????????
  const handleDownloadImage = () => {
    methods?.downloadImage?.(form, data?.settings, watchInfo);
  }

  // ??????????????????
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

  // ??????????????????
  const fetchWidgetAction = () => {
    useLoading && setLoading(true);
    setRefreshDisabled(true);
    methods?.fetchData?.(form, data?.settings, watchInfo).finally(() => {
      useLoading && setLoading(false);
      setRefreshDisabled(false);
    });
  }

  // ????????????
  const handleRefresh = (event: React.MouseEvent, data: WidgetType) => {
    handleStopPropagation(event);

    if (!data?.newWidget && !refreshDisabled) {
      fetchWidgetAction();
    }
  }

  const handleRefreshThrottle = useCallback(throttle(handleRefresh, 600), [handleRefresh]);

  // ??????????????????
  const handleKeyUpDelete = (event: React.KeyboardEvent) => {
    event?.stopPropagation();
    if (['Backspace', 'Delete'].includes(event?.code)) {
      handleWidgetDelete();
    }
  }

  // ???????????????????????????
  const emptyRender = (offset?: number) => {
    offset && setOffset(offset);
    return widgetEmptyMap?.[data.type]?.component({
      theme
    });
  }

  // ????????????
  const menu = useMemo(() => (
    <Menu theme="light" onClick={handleMenuItemClick}>
      {showOperator && (
        <Item key="setting" icon={<SettingOutlined />} >
          ??????
        </Item>
      )}
      {data?.type !== 'tabs' && (
        <>
          {/* {showOperator && (
            <Item key="move" icon={<LogoutOutlined />} >
              ??????
            </Item>
          )} */}
          {!showOperator && (
            <Item key="export" disabled={exportDisabled} icon={<DownloadOutlined />} >
              ????????????
            </Item>
          )}
        </>
      )}
      {!['tabs', 'table'].includes(data?.type) && !showOperator &&  (
        <Item key="download" icon={<FileImageOutlined />} >
          ????????????
        </Item>
      )}
      {showOperator && (
        <Item key="delete" icon={<DeleteOutlined />}>
          ??????
        </Item>
      )}
    </Menu>
  ), [data?.type, exportDisabled, handleMenuItemClick, showOperator]);

  // ????????????
  const titleRender = () => data?.settings?.style?.showTitle ? (
    <h2
      className={classNames({
        'widget-title': true,
        'light-theme-widget-title': theme === 'light',
        'dark-theme-widget-title': theme === 'dark',
      })}
    >
      {data?.settings?.style?.title}
    </h2>
  ) : null;

  // ??????????????????
  const refreshRender = () => (
    <div className="widget-operate-refresh">
      <SyncOutlined
        className={classNames({
          'widget-operate-base': true,
          'disabled-events': data?.newWidget || refreshDisabled,
          'light-theme-disabled-events': (data?.newWidget || refreshDisabled) && theme === 'light',
          'dark-theme-disabled-events': (data?.newWidget || refreshDisabled) && theme === 'dark',
        })}
        onClick={(event) => {
          handleRefreshThrottle(event, data);
        }}
      />
    </div>
  );

  // ??????????????????
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

  // ????????????????????????
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

  // ??????????????????
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
      className={classNames({
        'widget-container': true,
        'light-theme-widget-container': theme === 'light',
        'dark-theme-widget-container': theme === 'dark'
      })}
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
          <Space
            className={classNames({
              'widget-operate': true,
              'light-theme-widget-operate': theme === 'light',
              'dark-theme-widget-operate': theme === 'dark'
            })}
            size={8}
          >
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
            theme,
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

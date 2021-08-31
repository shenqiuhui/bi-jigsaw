import React, { memo, forwardRef, useState, useMemo, useCallback, useImperativeHandle, useEffect } from 'react';
import { Table, message } from 'antd';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import FileSaver from 'file-saver';
import moment from 'moment';
import { debounce } from 'lodash';
import { getTableData, exportData } from '@/service/widgetsApi';
import { ITableWidgetProps, IWidgetRef } from '../../../../types';

import './index.less';

interface IColumns {
  title: string;
  dataIndex: string;
}

const TableWidget = memo(forwardRef<IWidgetRef, ITableWidgetProps>((props, ref) => {
  const {
    type,
    isEdit,
    pageId,
    id: widgetId,
    filterValues,
    settings,
    emptyRender,
    onStyleSettingChange,
    onWatchInfoChange
  } = props;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [columns, setColumns] = useState<IColumns[]>([]);
  const [dataSource, setDataSource] = useState([]);
  const [tableHeadHeight, setTableHeadHeight] = useState<number>(39);

  // 是否存在数据
  const hasData = useMemo(() => {
    return columns?.length && dataSource?.length;
  }, [columns, dataSource]);

  // 实际每页条数
  const realPageSize = useMemo(() => {
    return isEdit ? settings?.style?.pageSize : pageSize;
  }, [isEdit, pageSize, settings?.style?.pageSize]);

  const handleChange = (page: number, pageSize: number | undefined) => {
    setPage(page);
    setPageSize(pageSize as number);
    onWatchInfoChange?.({ page, pageSize });
    onStyleSettingChange?.({ ...settings?.style, pageSize });
  }

  const fetchTableData = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading?.(true);

    try {
      const res: any = await getTableData({
        type,
        page,
        pageSize: realPageSize,
        pageId,
        widgetId,
        filterValues,
        settings
      });

      setColumns(res?.columns || []);
      setDataSource(res?.dataSource || []);
      setTotal(res?.total || 0);
    } catch (err) {}

    setLoading?.(false);
  }

  const downloadTableData = async (setDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
    setDisabled?.(true);

    try {
      const res: any = await exportData({
        type,
        pageId,
        widgetId,
        filterValues,
        settings
      });

      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });

      FileSaver.saveAs(blob, `${settings?.style?.title}${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.csv`);
      message.success('导出成功');
    } catch (err) {}

    setDisabled?.(false);
  }

  const dynamicTableHeadHeight = useCallback(() => {
    const tableHeadHightDom = document.querySelector(`.table-selector-${widgetId} .ant-table-thead`);
    const tableHeadHeight = tableHeadHightDom?.clientHeight;

    if (tableHeadHeight && typeof tableHeadHeight === 'number') {
      setTableHeadHeight(tableHeadHeight);
    }
  }, [widgetId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dynamicTableHeadHeightDebounce = useCallback(debounce(dynamicTableHeadHeight, 100), [dynamicTableHeadHeight]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dynamicTableHeadHeightDebounce();
  });

  useImperativeHandle(ref, () => ({
    fetchData: fetchTableData,
    exportData: downloadTableData
  }));

  return (
    <div className="table-widget-container">
      <AutoSizer
        className={classNames({
          [`table-selector-${widgetId}`]: true,
          'table-widget-auto-size': !hasData
        })}
        disableWidth
      >
        {({ height }) => hasData ? (
          <Table
            rowKey="id"
            size="small"
            tableLayout="fixed"
            columns={columns}
            dataSource={dataSource}
            scroll={{
              y: height - 56 - tableHeadHeight - 1,
            }}
            pagination={{
              total,
              current: page as number,
              pageSize: realPageSize as number,
              showSizeChanger: true,
              position: ['bottomCenter'],
              showTotal: (total) => (
                <span className="total-text">共 {total} 条</span>
              ),
              onChange: handleChange
            }}
          />
        ) : emptyRender?.()}
      </AutoSizer>
    </div>
  );
}));

export default TableWidget;

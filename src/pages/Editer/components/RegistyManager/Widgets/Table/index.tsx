import React, { memo, forwardRef, useState, useMemo, useImperativeHandle, useEffect } from 'react';
import { Table, message } from 'antd';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import FileSaver from 'file-saver';
import moment from 'moment';
import { getTableData, exportData } from '@/service/widgetsApi';
import { Settings } from '@/store/types';
import { ITableWidgetProps, IWidgetRef } from '../../../../types';

import './index.less';

interface IColumns {
  title: string;
  dataIndex: string;
}

const TableWidget = memo(forwardRef<IWidgetRef, ITableWidgetProps>((props, ref) => {
  const {
    isEdit,
    isSelected,
    type,
    pageId,
    id: widgetId,
    filterValues,
    settings,
    emptyRender,
    onStyleSettingChange,
    onWatchInfoChange
  } = props;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(settings?.style?.pageSize);
  const [total, setTotal] = useState<number>(0);
  const [columns, setColumns] = useState<IColumns[]>([]);
  const [dataSource, setDataSource] = useState([]);

  // 是否存在数据
  const hasData = useMemo(() => {
    return columns?.length && dataSource?.length;
  }, [columns, dataSource]);

  const handleChange = (page: number, pageSize: number | undefined) => {
    setPage(page);
    setPageSize(pageSize as number);
    onWatchInfoChange?.({ page, pageSize });
    onStyleSettingChange?.({ ...settings?.style, pageSize });
  }

  const columnAddWidth = (columns: IColumns[]) => {
    return columns?.map((column) => ({
      ...column,
      width: 200
    }));
  }

  const fetchTableData = async (settings: Settings) => {
    try {
      const res: any = await getTableData({
        type,
        page,
        pageSize: isEdit ? settings?.style?.pageSize : pageSize,
        pageId,
        widgetId,
        filterValues,
        settings
      });

      setColumns(columnAddWidth(res?.columns || []));
      setDataSource(res?.dataSource || []);
      setTotal(res?.total || 0);
    } catch (err) {}
  }

  const downloadTableData = async () => {
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
  }

  useEffect(() => {
    setPageSize(settings?.style?.pageSize as number);
  }, [settings?.style?.pageSize]);

  useImperativeHandle(ref, () => ({
    fetchData: fetchTableData,
    exportData: downloadTableData
  }));

  return (
    <div className="table-widget-container">
      <AutoSizer
        className={classNames({
          [`table-selector-${widgetId}`]: true,
          'table-widget-width': true,
          'table-widget-auto-size': !hasData
        })}
      >
        {({ width, height }) => hasData ? (
          <Table
            rowKey="id"
            size="small"
            tableLayout="fixed"
            columns={columns}
            dataSource={dataSource}
            scroll={{
              y: (isEdit && isSelected ? height + 2 : height) - 56 - 40,
              x: width
            }}
            pagination={{
              total,
              current: page,
              pageSize,
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

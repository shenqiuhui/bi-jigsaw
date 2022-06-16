import { memo, useState, useMemo, useEffect } from 'react';
import { Table, message } from 'antd';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';
import FileSaver from 'file-saver';
import moment from 'moment';
import { getTableData, exportData } from '@/service/apis/chart';
import { SettingType, FilterFormType, DataSettingType } from '@/core/render-engine';
import { TableWidgetProps } from '../types';

import './index.less';

interface IColumns {
  title: string;
  dataIndex: string;
}

const TableWidget: React.FC<TableWidgetProps> = memo((props) => {
  const {
    theme = 'light',
    isEdit,
    isSelected,
    type,
    pageId,
    id: widgetId,
    settings,
    emptyRender,
    onStyleSettingChange,
    onWatchInfoChange,
    methodsRegister
  } = props;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(settings?.style?.pageSize);
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState<IColumns[]>([]);
  const [dataSource, setDataSource] = useState([]);

  // 是否存在数据
  const hasData = useMemo(() => {
    return columns?.length && dataSource?.length;
  }, [columns, dataSource]);

  // 根据设置生成 columns 信息
  const tableColumns = useMemo(() => {
    const { dimensions = [], indicators = [] } = settings?.data;
    const fields = [ ...dimensions, ...indicators ];

    const fieldsMap = fields?.reduce((result: any, current: DataSettingType) => {
      return ((result[current.field] = current), result);
    }, {});

    return columns?.map((column) => ({
      width: 200,
      align: fieldsMap[column?.dataIndex]?.align,
      ...column,
    }));
  }, [settings?.data, columns]);

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

  const fetchTableData = async (form: FilterFormType, settings: SettingType, watchInfo: any) => {
    try {
      const res: any = await getTableData({
        type,
        page: watchInfo?.page || page,
        pageSize: (isEdit ? settings?.style?.pageSize : watchInfo?.pageSize) || pageSize,
        pageId,
        widgetId,
        filterValues: form,
        settings
      });

      setColumns(columnAddWidth(res?.columns || []));
      setDataSource(res?.dataSource || []);
      setTotal(res?.total || 0);
    } catch (err) {}
  }

  const downloadTableData = async (form: FilterFormType, settings: SettingType) => {
    try {
      const res: any = await exportData({
        type,
        pageId,
        widgetId,
        filterValues: form,
        settings
      });

      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });

      FileSaver.saveAs(blob, `${settings?.style?.title}${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.csv`);
      message.success({ className: theme, content: '导出成功' });
    } catch (err) {}
  }

  useEffect(() => {
    setPageSize(settings?.style?.pageSize as number);
  }, [settings?.style?.pageSize]);

  useEffect(() => {
    methodsRegister?.({
      fetchData: fetchTableData,
      exportData: downloadTableData
    });
  }, [theme]);

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
            columns={tableColumns}
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
});

export default TableWidget;

import React, { memo, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { message } from 'antd';
import { AutoSizer } from 'react-virtualized';
import classNames from 'classnames';
import * as echarts from 'echarts';
import { isEmpty } from 'lodash';
import FileSaver from 'file-saver';
import moment from 'moment';
import { getEchartsData, exportData } from '@/service/widgetsApi';
import { base64ToBlob } from '../../../../utils';
import { IWidgetDefaultProps, IWidgetRef } from '../../../../types';

import './index.less';

const ChartWidget = memo(forwardRef<IWidgetRef, IWidgetDefaultProps>((props, ref) => {
  const { type, pageId, api, id: widgetId, filterValues, settings, emptyRender } = props;
  const [options, setOptions] = useState({});
  const [charInstance, setCharInstance] = useState<echarts.EChartsType>();
  const chartRef = useRef<HTMLDivElement>(null);

  const fetchData = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading?.(true);

    try {
      const res: any = await getEchartsData({
        api,
        method: 'post',
        params: {
          type,
          pageId,
          widgetId,
          filterValues,
          settings
        },
      });

      setOptions(res || {});
    } catch (err) {}

    setLoading?.(false);
  }

  const downloadData = async (setDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
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

  const downloadImage = () => {
    if (isEmpty(options)) {
      return message.warning('图表数据为空');
    }

    const base64 = charInstance?.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#FFFFFF'
    }) as string;
    const blob = base64ToBlob(base64);

    FileSaver.saveAs(blob, `${settings?.style?.title}${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.png`);
    message.success('下载成功');
  }

  useImperativeHandle(ref, () => ({
    fetchData,
    exportData: downloadData,
    downloadImage: downloadImage
  }));

  useEffect(() => {
    if (!isEmpty(options)) {
      if (!charInstance) {
        const instance = echarts.init(chartRef?.current as HTMLDivElement);
        setCharInstance(instance);
      } else {
        charInstance?.clear();
        charInstance?.setOption(options, true);
      }
    }
  }, [charInstance, options]);

  return (
    <div className="chart-widget-container">
      <AutoSizer
        className={classNames({
          'chart-widget-auto-size': isEmpty(options)
        })}
      >
        {({ height, width }) => {
          charInstance?.resize({ height, width });

          return !isEmpty(options) ? (
            <div ref={chartRef} />
          ) : emptyRender?.();
        }}
      </AutoSizer>
    </div>
  );
}));

export default ChartWidget;

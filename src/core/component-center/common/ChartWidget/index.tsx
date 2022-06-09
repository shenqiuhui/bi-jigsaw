import { memo, useState, useMemo, useEffect, useRef } from 'react';
import { message } from 'antd';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import FileSaver from 'file-saver';
import moment from 'moment';
import { EChartsOption } from 'echarts-for-react';
import { getEchartData, exportData } from '@/service/apis/chart';
import { base64ToBlob } from '@/utils';
import { Settings, IWidgetDefaultProps, IFilterForm } from '@/core/render-engine/types';
import InnerChart, { ICharInstanceRef } from './InnerChart';

import './index.less';

interface IChartWidgetProps extends IWidgetDefaultProps {
  optionBuilder?: (data: any) => EChartsOption;
}

const ChartWidget: React.FC<IChartWidgetProps> = memo((props) => {
  const {
    type,
    pageId,
    api,
    id: widgetId,
    settings,
    optionBuilder,
    emptyRender,
    methodsRegister
  } = props;

  const [data, setData] = useState({});
  const chartRef = useRef<ICharInstanceRef>(null);

  const charOption = useMemo(() => {
    return optionBuilder?.(data);
  }, [data, settings]);

  const fetchData = async (form: IFilterForm, settings: Settings) => {
    try {
      const res: any = await getEchartData({
        api,
        method: 'post',
        params: {
          type,
          pageId,
          widgetId,
          filterValues: form,
          settings
        },
      });

      setData(res || {});
    } catch (err) {}
  }

  const downloadData = async (form: IFilterForm, settings: Settings) => {
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
      message.success('导出成功');
    } catch (err) {}
  }

  const downloadImage = () => {
    if (isEmpty(data)) {
      return message.warning('图表数据为空');
    }

    const base64 = chartRef?.current?.charInstance?.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#FFFFFF'
    }) as string;
    const blob = base64ToBlob(base64);

    FileSaver.saveAs(blob, `${settings?.style?.title}${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.png`);
    message.success('下载成功');
  }

  useEffect(() => {
    methodsRegister?.({
      fetchData,
      exportData: downloadData,
      downloadImage: downloadImage
    });
  }, []);

  return (
    <div className="chart-widget-container">
      <AutoSizer
        className={classNames({
          'chart-widget-auto-size': isEmpty(data)
        })}
      >
        {({ height, width }) => {
          return !isEmpty(data) ? (
            <InnerChart
              option={charOption}
              ref={chartRef}
              height={height}
              width={width}
            />
          ) : emptyRender?.();
        }}
      </AutoSizer>
    </div>
  );
});

export default ChartWidget;

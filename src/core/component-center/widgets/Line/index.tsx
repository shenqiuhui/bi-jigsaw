import { memo } from 'react';
import { Settings } from '@/core/render-engine/types';
import ChartWidget from '../../common/ChartWidget';
import { ILineWidgetProps, LegendType } from '../types';

const legendMap = {
  top: {},
  right: { right: 0 },
  bottom: { bottom: 0 },
  left: { left: 0 }
};

const LineWidget: React.FC<ILineWidgetProps> = memo((props) => {
  const { settings } = props;

  const seriesBuilder = (settings: Settings) => settings?.data?.indicators?.map((indicator) => {
    const isYAsix = settings?.style?.yAxisAll && settings?.style?.yAxisRight?.fields?.includes(indicator?.field);

    return {
      type: 'line',
      yAxisIndex: isYAsix ? 1 : 0
    };
  });

  const xAxisBuilder = (settings: Settings) => {
    return {
      name: settings?.style?.xAxis?.title,
      boundaryGap: false,
      type: 'category'
    };
  }

  const yAxisBuilder = (settings: Settings) => {
    const yAxisAll = [
      {
        position: 'left',
        name: settings?.style?.yAxisLeft?.title,
        min: settings?.style?.yAxisLeft?.rangeValues?.[0],
        max: settings?.style?.yAxisLeft?.rangeValues?.[1],
        axisLine: { lineStyle: { color: '#5470C6' }, show: true },
      },
      {
        position: 'right',
        name: settings?.style?.yAxisRight?.title,
        min: settings?.style?.yAxisRight?.rangeValues?.[0],
        max: settings?.style?.yAxisRight?.rangeValues?.[1],
        axisLine: { lineStyle: { color: '#EE6666' }, show: true },
      }
    ];

    return settings?.style?.yAxisAll ? yAxisAll : yAxisAll?.slice(0, 1);
  }

  const legendBuilder = (settings: Settings) => {
    return legendMap[settings?.style?.legend as LegendType];
  }

  const formatterBuilder = (params: any | Array<any>, data: any) => {
    let name: string;
    let value: string | number;
    let unit: string;

    if (Array.isArray(params)) {
      return params?.reduce((result, param) => {
        name = param?.dimensionNames?.[param?.encode?.y?.[0]];
        value = param?.value?.[name];
        unit = data?.unit?.[name];

        return `
          <div>
            <div>${result}</div>
            <div class="char-tooltip-content">
              <div>
                <span>${param.marker}</span>
                <span>${name}:</span>
              </div>
              <span class="char-tooltip-value char-tooltip-value-margin">
                ${value}${unit ? `(${unit})` : ''}
              </span>
            </div>
          </div>
        `;
      }, `${params?.[0]?.name}`);
    } else {
      name = params?.dimensionNames?.[params?.encode?.y[0]];
      value = params?.value[name];
      unit = data?.unit?.[name];

      return `
        <div>
          <div>${params?.name}</div>
          <div class="char-tooltip-content">
            <div>
              <span>${params?.marker}</span>
              <span>${name}:</span>
            </div>
            <span class="char-tooltip-value char-tooltip-value-margin">
              ${value}${unit ? `(${unit})` : ''}
            </span>
          </div>
        </div>
      `;
    }
  }

  const optionBuilder = (data: any) => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any | Array<any>) => formatterBuilder(params, data)
      },
      dataset: {
        dimensions: data?.dimensions,
        source: data?.source
      },
      legend: legendBuilder(settings),
      xAxis: xAxisBuilder(settings),
      yAxis: yAxisBuilder(settings),
      series: seriesBuilder(settings)
    };
  }

  return (
    <ChartWidget
      {...props}
      api="/api/line"
      optionBuilder={optionBuilder}
    />
  );
});

export default LineWidget;

import { memo } from 'react';
import { Settings } from '@/core/render-engine/types';
import ChartWidget from '../../common/ChartWidget';
import { IPieWidgetProps, LegendType } from '../types';

const legendMap = {
  top: {},
  right: { orient: 'vertical', right: 0 },
  bottom: { bottom: 0 },
  left: { orient: 'vertical', left: 0 }
};

const PieWidget: React.FC<IPieWidgetProps> = memo((props) => {
  const { settings } = props;

  const seriesBuilder = (settings: Settings, data: any) => {
    return [
      {
        data: data?.source,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        radius: settings?.style?.showType === '2'
          ? [`${settings?.style?.radiusPercentage}%`,'60%']
          : '60%',
        type: 'pie'
      }
    ];
  }

  const legendBuilder = (settings: Settings) => {
    return {
      type: 'scroll',
      ...legendMap[settings?.style?.legend as LegendType]
    };
  }

  const formatterBuilder = (settings: Settings, params: any | Array<any>) => {
    const labels = settings?.style.labels;
    const hasName = labels?.includes('1');
    const hasValue = labels?.includes('2');
    const hasPercent = labels?.includes('3');

    return `
      <div>
        ${hasName ? `<div>${params?.name}</div>` : ''}
        <div class="char-tooltip-content">
          ${hasValue && hasPercent ? `
            <div>
              <span>${params?.marker}</span>
              <span>${params?.value}:</span>
              <span class="char-tooltip-value char-tooltip-value-margin">
                ${params?.percent}(%)
              </span>
            </div>
          ` : ''}
          ${hasValue && !hasPercent ? `
            <span>${params?.marker}</span>
            <span>${params?.value}</span>
          `: ''}
          ${!hasValue && hasPercent ? `
            <span>${params?.marker}</span>
            <span class="char-tooltip-value">
              ${params?.percent}(%)
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }

  const optionBuilder = (data: any) => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any | Array<any>) => formatterBuilder(settings, params)
      },
      legend: legendBuilder(settings),
      series: seriesBuilder(settings, data),
    };
  }

  return (
    <ChartWidget
      {...props}
      api="/api/pie"
      optionBuilder={optionBuilder}
    />
  );
});

export default PieWidget;

import { useCallback } from 'react';
import { message } from 'antd';
import classNames from 'classnames';
import DataSetting from '../../common/DataSetting';
import ComplexSettingForm from '../../common/ComplexSettingForm';
import { BarSettingProps } from '../types';

import './index.less';

const settingDes = [
  { type: 'dimensions', title: 'x轴/维度' },
  { type: 'indicators', title: 'y轴/指标和度量' },
  { type: 'legends', title: '颜色图例' },
  { type: 'filters', title: '过滤项' }
];

const BarSetting: React.FC<BarSettingProps> = (props) => {
  const {
    type,
    activeTab,
    settings,
    pageId,
    widgetId,
    onDataSettingChange,
    onStyleSettingChange
  } = props;

  // 字段校验规则
  const validator = useCallback((result) => {
    const droppableId = result?.destination?.droppableId;
    const dimensions = settings?.data?.dimensions || [];
    const legends = settings?.data?.legends || [];

    if (droppableId === 'dimensions' && dimensions?.length > 0) {
      message.warning('柱状图维度中最多存在一个字段');
      return false;
    }

    if (droppableId === 'legends' && legends?.length > 0) {
      message.warning('柱状图图例中最多存在一个字段');
      return false;
    }

    return true;
  }, [settings]);

  return (
    <div className="bar-setting-container">
      <div
        className={classNames({
          'bar-setting': true,
          'bar-data-setting': activeTab === 'data'
        })}
      >
        <DataSetting
          type={type}
          pageId={pageId}
          widgetId={widgetId}
          dataSetting={settings?.data}
          settingDes={settingDes}
          validator={validator}
          onDataSettingChange={onDataSettingChange}
        />
      </div>
      <div
        className={classNames({
          'bar-setting': true,
          'bar-style-setting': activeTab === 'style'
        })}
      >
        <ComplexSettingForm
          type={type}
          fields={settings?.data?.indicators}
          styleSetting={settings?.style}
          onStyleSettingChange={onStyleSettingChange}
        />
      </div>
    </div>
  );
}

export default BarSetting;

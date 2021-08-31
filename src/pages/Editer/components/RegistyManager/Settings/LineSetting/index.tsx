import React, { useCallback } from 'react';
import { message } from 'antd';
import classNames from 'classnames';
import DataSetting from '../../Common/DataSetting';
import ComplexSettingForm from '../../Common/ComplexSettingForm';
import { ILineSettingProps } from '../../../../types';

import './index.less';

const settingDes = [
  { type: 'dimensions', title: 'x轴/维度' },
  { type: 'indicators', title: 'y轴/指标和度量' },
  { type: 'legends', title: '颜色图例' },
  { type: 'filters', title: '过滤项' }
];

const LineSetting: React.FC<ILineSettingProps> = (props) => {
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
  const validater = useCallback((result) => {
    const droppableId = result?.destination?.droppableId;
    const dimensions = settings?.data?.dimensions || [];
    const legends = settings?.data?.legends || [];

    if (droppableId === 'dimensions' && dimensions?.length > 0) {
      message.warning('折线图维度中最多存在一个字段');
      return false;
    }

    if (droppableId === 'legends' && legends?.length > 0) {
      message.warning('折线图图例中最多存在一个字段');
      return false;
    }

    return true;
  }, [settings]);

  return (
    <div className="line-setting-container">
      <div
        className={classNames({
          'line-setting': true,
          'line-data-setting': activeTab === 'data'
        })}
      >
        <DataSetting
          type={type}
          pageId={pageId}
          widgetId={widgetId}
          dataSetting={settings?.data}
          settingDes={settingDes}
          validater={validater}
          onDataSettingChange={onDataSettingChange}
        />
      </div>
      <div
        className={classNames({
          'line-setting': true,
          'line-style-setting': activeTab === 'style'
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

export default LineSetting;

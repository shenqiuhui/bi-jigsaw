import React, { useEffect, useCallback } from 'react';
import { Form, Input, Checkbox, Radio, InputNumber, message } from 'antd';
import { debounce } from 'lodash';
import classNames from 'classnames';
import DataSetting from '../../Common/DataSetting';
import LabelRender from '../../Common/LabelRender';
import { IPieSettingProps } from '../../../../types';

import './index.less';

const { Item, useForm } = Form;

const settingDes = [
  { type: 'dimensions', title: '扇区标签/维度' },
  { type: 'indicators', title: '扇区角度/指标和度量' },
  { type: 'filters', title: '过滤项' }
];

const PieSetting: React.FC<IPieSettingProps> = (props) => {
  const {
    type,
    activeTab,
    settings,
    pageId,
    widgetId,
    onDataSettingChange,
    onStyleSettingChange
  } = props;

  const [form] = useForm();

  // 字段校验规则
  const validater = useCallback((result) => {
    const droppableId = result?.destination?.droppableId;
    const dimensions = settings?.data?.dimensions || [];
    const indicators = settings?.data?.indicators || [];

    if (droppableId === 'dimensions' && dimensions?.length > 0) {
      message.warning('饼图维度中最多存在一个字段');
      return false;
    }

    if (droppableId === 'indicators' && indicators?.length > 0) {
      message.warning('饼图指标中最多存在一个字段');
      return false;
    }

    return true;
  }, [settings]);

  const handleChange = useCallback((filedName, value, styleSettings) => {
    if (value === '') {
      return message.warn('饼图组件标题不能为空，保存后将保持原标题');
    }

    if (value == null) {
      return message.warn('半径占比不允许为空，保存将保持原设置');
    };

    onStyleSettingChange?.({ ...styleSettings, [filedName]: value });
  }, [onStyleSettingChange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounce = useCallback(debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    if (activeTab === 'style') {
      form.setFieldsValue(settings?.style);
    }
  }, [activeTab, form, settings?.style]);

  return (
    <div className="pie-setting-container">
      <div
        className={classNames({
          'pie-setting': true,
          'pie-data-setting': activeTab === 'data'
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
          'pie-setting': true,
          'pie-style-setting': activeTab === 'style'
        })}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={settings?.style}
        >
          <Item
            name="title"
            className="item-title"
            label={<LabelRender name="标题" />}
          >
            <Input
              placeholder="请输入标题"
              autoComplete="off"
              onChange={(event) => {
                handleChangeDebounce('title', event?.target?.value?.trim(), settings?.style);
              }}
            />
          </Item>
          <Item name="showTitle" valuePropName="checked">
            <Checkbox
              className="item-color"
              onChange={(event) => {
                handleChange('showTitle', event?.target?.checked, settings?.style);
              }}
            >
              显示标题
            </Checkbox>
          </Item>
          <Item label={<LabelRender name="可视化类型" />}>
            <Item name="showType" noStyle>
              <Radio.Group
                size="small"
                onChange={(event) => {
                  handleChange('showType', event?.target?.value, settings?.style);
                }}
              >
                <Radio value="1">饼图</Radio>
                <Radio value="2">环图</Radio>
              </Radio.Group>
            </Item>
            <Item name="radiusPercentage" noStyle>
              <InputNumber
                className="percent-input"
                placeholder="请输入"
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value?.replace('%', '') as unknown as 0 | 100}
                onChange={(value) => {
                  handleChange('radiusPercentage', value, settings?.style);
                }}
              />
            </Item>
            <span className="item-color item-unit">
              半径占比
            </span>
          </Item>
          <Item
            name="labels"
            label={<LabelRender name="显示标签" />}
          >
            <Checkbox.Group onChange={(value) => {
              handleChange('labels', value, settings?.style);
            }}>
              <Checkbox className="item-color" value="1">
                维度
              </Checkbox>
              <Checkbox className="item-color" value="2">
                度量
              </Checkbox>
              <Checkbox className="item-color" value="3">
                占比
              </Checkbox>
            </Checkbox.Group>
          </Item>
        </Form>
      </div>
    </div>
  );
}

export default PieSetting;

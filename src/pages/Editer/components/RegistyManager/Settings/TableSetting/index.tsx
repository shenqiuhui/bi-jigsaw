import React, { useEffect, useCallback } from 'react';
import { Form, Input, Checkbox, Select, message } from 'antd';
import { debounce } from 'lodash';
import classNames from 'classnames';
import DataSetting from '../../Common/DataSetting';
import LabelRender from '../../Common/LabelRender';
import ItemGroup from '../../Common/ItemGroup';
import { ITableSettingProps } from '../../../../types';

import './index.less';

const { Item, useForm } = Form;

const sizeChangeOptions = [
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 }
];

const settingDes = [
  { type: 'dimensions', title: '行/维度' },
  { type: 'indicators', title: '列/指标和度量' },
  { type: 'filters', title: '过滤项' }
];

const TableSetting: React.FC<ITableSettingProps> = (props) => {
  const {
    type,
    activeTab,
    settings,
    pageId,
    widgetId,
    onDataSettingChange,
    onStyleSettingChange,
    onWatchInfoChange
  } = props;

  const [form] = useForm();

  const handleChange = useCallback((filedName, value, styleSettings) => {
    if (value === '') {
      return message.warn('表格组件标题不能为空，保存后将保持原标题');
    }

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
    <div className="table-setting-container">
      <div
        className={classNames({
          'table-setting': true,
          'table-data-setting': activeTab === 'data'
        })}
      >
        <DataSetting
          type={type}
          pageId={pageId}
          widgetId={widgetId}
          dataSetting={settings?.data}
          settingDes={settingDes}
          onDataSettingChange={onDataSettingChange}
        />
      </div>
      <div
        className={classNames({
          'table-setting': true,
          'table-style-setting': activeTab === 'style'
        })}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={settings?.style}
        >
          <ItemGroup
            label={<LabelRender name="标题" />}
            padding={[15, 12, 12]}
          >
            <Item
              className="item-title"
              name="title"
            >
              <Input
                placeholder="请输入标题"
                autoComplete="off"
                onChange={(event) => {
                  handleChangeDebounce('title', event?.target?.value?.trim(), settings?.style);
                }}
              />
            </Item>
            <Item
              name="showTitle"
              valuePropName="checked"
            >
              <Checkbox
                onChange={(event) => {
                  handleChange('showTitle', event?.target?.checked, settings?.style);
                }}
              >
                显示标题
              </Checkbox>
            </Item>
          </ItemGroup>
          <ItemGroup label={<LabelRender name="分页" />}>
            <Item name="pageSize" noStyle>
              <Select
                size="small"
                style={{ width: 70 }}
                options={sizeChangeOptions}
                onChange={(value) => {
                  onWatchInfoChange?.({ pageSize: value });
                  handleChange('pageSize', value, settings?.style);
                }}
              />
            </Item>
            <span className="item-unit">
              条/页
            </span>
          </ItemGroup>
        </Form>
      </div>
    </div>
  );
}

export default TableSetting;

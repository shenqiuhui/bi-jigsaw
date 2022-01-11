import React, { useEffect, useCallback } from 'react';
import { Form, Input, Checkbox, Radio, message } from 'antd';
import { debounce } from 'lodash';
import { ITabs } from '@/store/types';
import TabCollections from './TabCollections';
import LabelRender from '../../Common/LabelRender';
import { ITabsSettingProps } from '../../../../types';

import './index.less';

const { Item, useForm } = Form;
const { Group } = Radio;

const TabsSetting: React.FC<ITabsSettingProps> = (props) => {
  const { settings, onStyleSettingChange } = props;

  const [form] = useForm();

  // 校验是否有编辑项
  const validateHasEditItem = (tabList: ITabs[]) => {
    return tabList?.some((tab) => !tab?.name);
  }

  const handleChange = useCallback((filedName, value, styleSettings) => {
    if (value === '') {
      return message.warn('标签页容器组件标题不能为空，保存后将保持原标题');
    }

    if (Array.isArray(value) && validateHasEditItem(value)) {
      return message.warn('标签页名称不能为空，保存后将保持原设置');
    }

    onStyleSettingChange?.({ ...styleSettings, [filedName]: value });
  }, [onStyleSettingChange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounce = useCallback(debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    form.setFieldsValue(settings?.style);
  }, [form, settings?.style]);

  return (
    <div className="tabs-setting-container">
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
            onChange={(event) => {
              handleChange('showTitle', event?.target?.checked, settings?.style);
            }}
          >
            显示标题
          </Checkbox>
        </Item>
        <Item
          name="align"
          label={<LabelRender name="标签页位置" />}
        >
          <Group
            size="small"
            onChange={(event) => {
              handleChange('align', event?.target?.value, settings?.style);
            }}
          >
            <Radio value="left">居左</Radio>
            <Radio value="center">居中</Radio>
            <Radio value="right">居右</Radio>
          </Group>
        </Item>
        <Item
          name="tabs"
          label={<LabelRender name="标签" />}
        >
          <TabCollections
            validateHasEditItem={validateHasEditItem}
            onChange={(value) => {
              handleChange('tabs', value, settings?.style)
            }}
          />
        </Item>
      </Form>
    </div>
  );
}

export default TabsSetting;

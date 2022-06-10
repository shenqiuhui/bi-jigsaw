import { useEffect, useCallback } from 'react';
import { Form, Input, Checkbox, Radio, message } from 'antd';
import { debounce } from 'lodash';
import { ITab } from '@/core/render-engine/types';
import TabCollections from './TabCollections';
import ItemGroup from '../../common/ItemGroup';
import LabelRender from '../../common/LabelRender';
import { ITabsSettingProps } from '../types';

import './index.less';

const { Item, useForm } = Form;
const { Group } = Radio;

const TabsSetting: React.FC<ITabsSettingProps> = (props) => {
  const { settings, onStyleSettingChange } = props;

  const [form] = useForm();

  // 校验是否有编辑项
  const validateHasEditItem = (tabList: ITab[]) => {
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
        <ItemGroup
          label={<LabelRender name="标题" />}
          padding={[15, 12, 12]}
        >
          <Item
            name="title"
            className="item-title"
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
        </ItemGroup>
        <ItemGroup label={<LabelRender name="标签页位置" />}>
          <Item name="align">
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
        </ItemGroup>
        <ItemGroup label={<LabelRender name="标签" />}>
          <Item name="tabs">
            <TabCollections
              validateHasEditItem={validateHasEditItem}
              onChange={(value) => {
                handleChangeDebounce('tabs', value, settings?.style)
              }}
            />
          </Item>
        </ItemGroup>
      </Form>
    </div>
  );
}

export default TabsSetting;

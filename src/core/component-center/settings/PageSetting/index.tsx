import { useCallback, useEffect } from 'react';
import { Form, Input, Radio, message } from 'antd';
import { debounce } from 'lodash';
import { checkUniqueName } from '@/service/apis/dashboard';
import LabelRender from '../../common/LabelRender';
import ItemGroup from '../../common/ItemGroup';
import { IPageSettingProps } from '../types';

import './index.less';

type Validator = (spaceId: string, title: string) => Promise<boolean>;

const { Item, useForm } = Form;
const { TextArea } = Input;
const { Group } = Radio;

const PageSetting: React.FC<IPageSettingProps> = (props) => {
  const { spaceId, settings, onPageSettingChange } = props;

  const [form] = useForm();

  // 仪表板名称查重函数
  const validatePageName = useCallback(async (spaceId, title) => {
    const res: any = await checkUniqueName({ spaceId, title });
    return res?.status === 'success';
  }, []);

  // 变更事件
  const handleChange = useCallback(async (filedName, value, settings, spaceId?: string, validator?: Validator) => {
    if (!value) return;

    if (filedName === 'name') {
      const checkResult = await validator?.(spaceId as string, value);
      if (!checkResult) {
        return message.error('仪表板名称已存在，保存后将保持原名称');
      }
    }

    onPageSettingChange?.({ ...settings, [filedName]: value });
  }, [onPageSettingChange]);

  const handleChangeDebounce = useCallback(debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [form, settings]);

  return (
    <div className="default-setting-container">
      <Form
        layout="vertical"
        form={form}
        initialValues={settings}
      >
        <Item
          name="name"
          label={<LabelRender name="仪表板名称" />}
        >
          <Input
            placeholder="请输入仪表板名称"
            autoComplete="off"
            onChange={(event) => {
              handleChangeDebounce('name', event?.target?.value?.trim(), settings, spaceId, validatePageName);
            }}
          />
        </Item>
        <Item
          name="description"
          label={<LabelRender name="描述" />}
        >
          <TextArea
            placeholder="请输入描述"
            maxLength={200}
            autoSize={{ minRows: 3 }}
            onChange={(event) => {
              handleChangeDebounce('description', event?.target?.value?.trim(), settings);
            }}
          />
        </Item>
        <ItemGroup label={<LabelRender name="主题" />}>
          <Item
            className="form-item-horizontal"
            name="theme"
          >
            <Group
              size="small"
              onChange={(event) => {
                handleChange('theme', event?.target?.value, settings);
              }}
            >
              <Radio value="light">浅色</Radio>
              {/* <Radio value="dark">深色</Radio> */}
            </Group>
          </Item>
        </ItemGroup>
      </Form>
    </div>
  );
}

export default PageSetting;

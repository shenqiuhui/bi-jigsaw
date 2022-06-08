import { useCallback, useEffect } from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { debounce } from 'lodash';
import LabelRender from '../../common/LabelRender';
import ItemGroup from '../../common/ItemGroup';
import ColorPicker from '../../common/ColorPicker';
import { ITextSettingProps } from '../types';

import './index.less';

const { Item, useForm } = Form;
const { TextArea } = Input;

const options = [
  { value: 14, label: '14px' },
  { value: 16, label: '16px' },
  { value: 18, label: '18px' },
  { value: 20, label: '20px' },
  { value: 24, label: '24px' },
  { value: 36, label: '36px' },
  { value: 48, label: '48px' }
];

const itemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 }
};

const TextSetting: React.FC<ITextSettingProps> = (props) => {
  const { settings, onStyleSettingChange } = props;

  const [form] = useForm();

  // 变更事件
  const handleChange = useCallback((filedName, value, settings) => {
    onStyleSettingChange?.({ ...settings, [filedName]: value });
  }, [onStyleSettingChange]);

  const handleChangeDebounce = useCallback(debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    form.setFieldsValue(settings?.style);
  }, [form, settings]);

  return (
    <div className="text-setting-container">
      <Form
        layout="vertical"
        form={form}
        initialValues={settings?.style}
      >
        <Item
          name="value"
          label={<LabelRender name="文本内容" />}
        >
          <TextArea
            placeholder="多行输入，支持回车换行"
            autoSize={{ minRows: 6, maxRows: 12 }}
            onChange={(event) => {
              handleChangeDebounce('value', event?.target?.value, settings?.style);
            }}
          />
        </Item>
        <ItemGroup label={<LabelRender name="样式配置" />}>
          <Row>
            <Col span={12}>
              <Item
                className="form-item-horizontal"
                name="fontSize"
                label={<LabelRender name="文本字号" />}
                {...itemLayout}
              >
                <Select
                  size="small"
                  style={{ width: 70 }}
                  options={options}
                  onChange={(value) => {
                    handleChange('fontSize', value, settings?.style);
                  }}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                className="form-item-horizontal"
                name="color"
                label={<LabelRender name="文本颜色" />}
                {...itemLayout}
              >
                <ColorPicker
                  placement="bottom"
                  disableAlpha
                  onChange={(value) => {
                    handleChange('color', value?.hex, settings?.style);
                  }}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                className="form-item-horizontal last-form-item-horizontal"
                name="backgroundColor"
                label={<LabelRender name="背景颜色" />}
                {...itemLayout}
              >
                <ColorPicker
                  placement="bottom"
                  disableAlpha
                  onChange={(value) => {
                    handleChange('backgroundColor', value?.hex, settings?.style);
                  }}
                />
              </Item>
            </Col>
          </Row>
        </ItemGroup>
      </Form>
    </div>
  );
}

export default TextSetting;

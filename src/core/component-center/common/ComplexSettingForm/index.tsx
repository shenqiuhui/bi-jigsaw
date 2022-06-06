import { useEffect, useCallback, useMemo } from 'react';
import { Form, Input, Checkbox, Radio, Select, message } from 'antd';
import { debounce } from 'lodash';
import { Settings, IDataSetting } from '@/core/render-engine/types';
import RangeValues from './RangeValues';
import LabelRender from '../LabelRender';
import ItemGroup from '../ItemGroup';

import './index.less';

interface IComplexSettingFormProps {
  fields?: IDataSetting[];
  styleSetting: Settings['style'];
  type?: string;
  onStyleSettingChange?: ((dataSettings: Settings['style']) => void) | undefined;
}

interface IWidgetNames {
  [key: string]: string;
}

const { Item, useForm } = Form;
const { Group } = Radio;

const itemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const axisDes = [
  {
    key: 'xAxis',
    label: 'x轴',
    always: true,
    extra: false,
    titleName: ['xAxis', 'title']
  },
  {
    key: 'yAxisLeft',
    label: '左y轴',
    always: true,
    extra: true,
    titleName: ['yAxisLeft', 'title'],
    fieldName: ['yAxisLeft', 'fields'],
    rangeName: ['yAxisLeft', 'rangeValues']
  },
  {
    key: 'yAxisRight',
    label: '右y轴',
    always: false,
    extra: false,
    titleName: ['yAxisRight', 'title'],
    fieldName: ['yAxisRight', 'fields'],
    rangeName: ['yAxisRight', 'rangeValues'],
  }
];

const widgetNames: IWidgetNames = {
  line: '折线图',
  bar: '柱状图',
  complex: '组合图'
};

const ComplexSettingFormProps: React.FC<IComplexSettingFormProps> = (props) => {
  const { type = '', fields = [], styleSetting, onStyleSettingChange } = props;

  const [form] = useForm();

  const fieldsOptions = useMemo(() => {
    return fields.map(({ field, name }) => ({ value: field, label: name })).filter(({ value }) => {
      return !(styleSetting?.yAxisLeft?.fields?.includes(value) || styleSetting?.yAxisRight?.fields?.includes(value));
    });
  }, [fields, styleSetting?.yAxisLeft?.fields, styleSetting?.yAxisRight?.fields]);

  const handleChange = useCallback((filedName, value, styleSettings) => {
    let form = {};

    if (Array.isArray(filedName)) {
      const [key, subKey] = filedName;

      form = {
        ...styleSettings,
        [key]: {
          ...styleSettings[key],
          [subKey]: value
        }
      };
    } else {
      if (value === '') {
        return message.warn(`${widgetNames?.[type]}组件标题不能为空，保存后将保持原标题`);
      }

      form = {
        ...styleSettings,
        [filedName]: value
      };
    }
    onStyleSettingChange?.(form);
  }, [onStyleSettingChange, type]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounce = useCallback(debounce(handleChange, 300), [handleChange]);

  useEffect(() => {
    form.setFieldsValue(styleSetting);
  }, [form, styleSetting]);

  return (
    <div className="setting-form-container">
      <Form
        layout="vertical"
        form={form}
        initialValues={styleSetting}
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
                handleChangeDebounce('title', event?.target?.value?.trim(), styleSetting);
              }}
            />
          </Item>
          <Item name="showTitle" valuePropName="checked">
            <Checkbox
              className="item-color"
              onChange={(event) => {
                handleChange('showTitle', event?.target?.checked, styleSetting);
              }}
            >
              显示标题
            </Checkbox>
          </Item>
        </ItemGroup>
        <ItemGroup label={<LabelRender name="图例位置" />}>
          <Item name="legend">
            <Group
              size="small"
              onChange={(event) => {
                handleChange('legend', event?.target?.value, styleSetting);
              }}
            >
              <Radio value="top">上</Radio>
              <Radio value="right">右</Radio>
              <Radio value="bottom">下</Radio>
              <Radio value="left">左</Radio>
            </Group>
          </Item>
        </ItemGroup>
        {axisDes?.map((des) => (des?.always || styleSetting?.yAxisAll) && (
          <ItemGroup
            key={des?.key}
            label={<LabelRender name={des?.label} />}
            padding={[15, 12]}
            extra={() => des?.extra && (
              <Item name="yAxisAll" valuePropName="checked">
                <Checkbox
                  className="item-color"
                  onChange={(event) => {
                    handleChange('yAxisAll', event?.target?.checked, styleSetting);
                  }}
                >
                  显示双y轴
                </Checkbox>
              </Item>
            )}
          >
            {des?.titleName && (
              <Item
                className="form-item-horizontal"
                name={des?.titleName}
                label={<LabelRender name="轴标题" />}
                labelAlign="left"
                {...itemLayout}
              >
                <Input
                  placeholder="请输入标题"
                  autoComplete="off"
                  onChange={(event) => {
                    handleChangeDebounce(des?.titleName, event?.target?.value?.trim(), styleSetting);
                  }}
                />
              </Item>
            )}
            {des?.fieldName && (
              <Item
                className="form-item-horizontal"
                name={des?.fieldName}
                label={<LabelRender name="系列" />}
                labelAlign="left"
                {...itemLayout}
              >
                <Select
                  showArrow
                  filterOption
                  optionFilterProp="label"
                  placeholder="请选择"
                  mode="multiple"
                  options={fieldsOptions}
                  onChange={(value) => {
                    handleChange(des?.fieldName, value, styleSetting);
                  }}
                  notFoundContent={
                    <div style={{ textAlign: 'center' }}>暂无可选字段</div>
                  }
                />
              </Item>
            )}
            {des?.rangeName && (
              <Item
                className="form-item-horizontal number-input-item"
                name={des?.rangeName}
                label={<LabelRender name="取值范围" />}
                labelAlign="left"
                {...itemLayout}
              >
                <RangeValues onChange={(value) => {
                  handleChangeDebounce(des?.rangeName, value, styleSetting);
                }} />
              </Item>
            )}
          </ItemGroup>
        ))}
      </Form>
    </div>
  );
}

export default ComplexSettingFormProps;

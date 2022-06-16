import { useEffect, useCallback } from 'react';
import { Form, Input, Checkbox, Radio, InputNumber, message } from 'antd';
import { debounce } from 'lodash';
import classNames from 'classnames';
import DataSetting from '../../common/DataSetting';
import LabelRender from '../../common/LabelRender';
import ItemGroup from '../../common/ItemGroup';
import { PieSettingProps } from '../types';

import './index.less';

const { Item, useForm } = Form;
const { Group } = Radio;

const settingDes = [
  { type: 'dimensions', title: '扇区标签/维度' },
  { type: 'indicators', title: '扇区角度/指标和度量' },
  { type: 'filters', title: '过滤项' }
];

const PieSetting: React.FC<PieSettingProps> = (props) => {
  const {
    theme = 'light',
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
  const validator = useCallback((result) => {
    const droppableId = result?.destination?.droppableId;
    const dimensions = settings?.data?.dimensions || [];
    const indicators = settings?.data?.indicators || [];

    if (droppableId === 'dimensions' && dimensions?.length > 0) {
      message.warning({ className: theme, content: '饼图维度中最多存在一个字段' });
      return false;
    }

    if (droppableId === 'indicators' && indicators?.length > 0) {
      message.warning({ className: theme, content: '饼图指标中最多存在一个字段' });
      return false;
    }

    return true;
  }, [settings]);

  const handleChange = useCallback((filedName, value, styleSettings) => {
    if (value === '') {
      return message.warning({ className: theme, content: '饼图组件标题不能为空，保存后将保持原标题' });
    }

    if (value == null) {
      return message.warning({ className: theme, content: '半径占比不允许为空，保存将保持原设置' });
    };

    onStyleSettingChange?.({ ...styleSettings, [filedName]: value });
  }, [onStyleSettingChange]);

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
          theme={theme}
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
          'pie-setting': true,
          'pie-style-setting': activeTab === 'style'
        })}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={settings?.style}
        >
          <ItemGroup
            theme={theme}
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
                className="item-color"
                onChange={(event) => {
                  handleChange('showTitle', event?.target?.checked, settings?.style);
                }}
              >
                显示标题
              </Checkbox>
            </Item>
          </ItemGroup>
          <ItemGroup
            theme={theme}
            label={<LabelRender name="图例位置" />}
          >
            <Item name="legend">
              <Group
                size="small"
                onChange={(event) => {
                  handleChange('legend', event?.target?.value, settings?.style);
                }}
              >
                <Radio value="top">上</Radio>
                <Radio value="right">右</Radio>
                <Radio value="bottom">下</Radio>
                <Radio value="left">左</Radio>
              </Group>
            </Item>
          </ItemGroup>
          <ItemGroup
            theme={theme}
            label={<LabelRender name="可视化类型" />}
          >
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
            <span className="item-unit">
              半径占比
            </span>
          </ItemGroup>
          <ItemGroup
            theme={theme}
            label={<LabelRender name="显示标签" />}
          >
            <Item name="labels">
              <Checkbox.Group onChange={(value) => {
                handleChange('labels', value, settings?.style);
              }}>
                <Checkbox value="1">
                  维度
                </Checkbox>
                <Checkbox value="2">
                  度量
                </Checkbox>
                <Checkbox value="3">
                  占比
                </Checkbox>
              </Checkbox.Group>
            </Item>
          </ItemGroup>
        </Form>
      </div>
    </div>
  );
}

export default PieSetting;

import { useState, useEffect, useMemo } from 'react';
import { Modal, Space, Button, Form, Input, Radio, Select, Row, Col } from 'antd';
import { getFilterSelectList } from '@/service/apis/dashboard';
import { useConfig } from '@/core/register';
import { DataSettingType, DragType, OptionType, FieldDataType } from '@/core/render-engine';
import { ratioAggregatefuncOptions, formatTypeOptions, conditionFilterTypeOptions, enumFilterTypeOptions } from './config';

interface FieldSetterProps {
  widgetId?: string;
  planId: number;
  type: string;
  data: DataSettingType | DragType;
  fields: FieldDataType[];
  visible: boolean;
  droppableId: string;
  index: number;
  onVisibleChange?: (visible: boolean) => void;
  onFieldInfoSave?: ((field: DataSettingType | DragType, droppableId: string, index: number) => void) | undefined;
}

const { Item, useForm } = Form;
const { Group } = Radio;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const FieldSetter: React.FC<FieldSetterProps> = (props) => {
  const {
    planId,
    widgetId,
    index,
    type,
    data,
    fields,
    visible,
    droppableId,
    onVisibleChange,
    onFieldInfoSave
  } = props;

  const [form] = useForm();
  const [filterValues, setFilterValues] = useState<OptionType[]>([]);
  const [dataSettingConfig] = useConfig('settings');

  const ratioFieldOptions = useMemo(() => {
    return fields?.map(({ name, field }) => ({ label: name, value: field }));
  }, [fields]);

  const handleSave = async () => {
    try {
      await form.validateFields();

      const formKeys = Object.keys(dataSettingConfig?.defaultParams)?.filter((key) => key !== 'type');
      const formValues = form.getFieldsValue(formKeys);

      onFieldInfoSave?.(formValues, droppableId, index);
      onVisibleChange?.(false);
    } catch (err) {}
  }

  const fetchFilterSelectList = async () => {
    try {
      const res: any = await getFilterSelectList({
        api: '/api/options',
        method: 'post',
        params: {
          widgetFieldList: [
            {
              widgetId,
              planId,
              field: data?.field,
            }
          ]
        },
      });
      setFilterValues(res);
    } catch (err) {}
  }

  useEffect(() => {
    if (droppableId === 'filters') {
      fetchFilterSelectList();
    }
  }, []);

  return (
    <Modal
      title="????????????"
      destroyOnClose
      keyboard
      width={800}
      visible={visible}
      maskClosable={false}
      onCancel={() => onVisibleChange?.(false)}
      footer={
        <Space size={16}>
          <Button onClick={() => onVisibleChange?.(false)}>
            ??????
          </Button>
          <Button type="primary" onClick={handleSave}>
            ??????
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        initialValues={data}
        {...formLayout}
      >
        <Item label="?????????">
          <span>{data?.field}</span>
        </Item>
        {droppableId !== 'filters' && (
          <Item name="rename" label="?????????">
            <Input placeholder="?????????" autoComplete="off" />
          </Item>
        )}
        {droppableId !== 'filters' && (
          <Item name="align" label="????????????">
            <Group>
              <Radio value="left">?????????</Radio>
              <Radio value="center">??????</Radio>
              <Radio value="right">?????????</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'indicators' && (
          <Item name="aggregatefunc" label="????????????">
            <Group>
              <Radio value="sum">??????</Radio>
              <Radio value="avg">?????????</Radio>
              <Radio value="count">??????</Radio>
              <Radio value="count-distinct">????????????</Radio>
              <Radio value="group-ratio">????????????</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'indicators' && (
          <Item
            noStyle
            shouldUpdate={(prev, next) => prev?.aggregatefunc !== next?.aggregatefunc}
          >
            {({ getFieldValue }) => {
              const aggregatefunc = getFieldValue('aggregatefunc');

              return aggregatefunc === 'group-ratio' && (
                <Item label="????????????">
                  <Row gutter={8}>
                    <Col span={4}>
                      <Item name="ratioNumeratorAggregatefunc" noStyle>
                        <Select options={ratioAggregatefuncOptions} />
                      </Item>
                    </Col>
                    <Col span={7}>
                      <Item
                        label="????????????"
                        name="ratioNumeratorField"
                        rules={[{ required: true, message: '?????????????????????' }]}
                        noStyle
                      >
                        <Select
                          allowClear
                          placeholder="???????????????"
                          options={ratioFieldOptions}
                        />
                      </Item>
                    </Col>
                    <Col className="ratio-character" span={2}>/</Col>
                    <Col span={4}>
                      <Item name="ratioDenominatorAggregatefunc" noStyle>
                        <Select options={ratioAggregatefuncOptions} />
                      </Item>
                    </Col>
                    <Col span={7}>
                      <Item
                        label="????????????"
                        name="ratioDenominatorField"
                        rules={[{ required: true, message: '?????????????????????' }]}
                        noStyle
                      >
                        <Select
                          allowClear
                          placeholder="???????????????"
                          options={ratioFieldOptions}
                        />
                      </Item>
                    </Col>
                  </Row>
                </Item>
              );
            }}
          </Item>
        )}
        {droppableId === 'indicators' && (
          <Item name="formatType" label="???????????????">
            <Select options={formatTypeOptions} />
          </Item>
        )}
        {droppableId !== 'filters' && (
          <Item name="order" label="??????">
            <Group>
              <Radio value="none">?????????</Radio>
              <Radio value="asc">??????</Radio>
              <Radio value="desc">??????</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'indicators' && type === 'complex' && (
          <Item name="showType" label="????????????">
            <Group>
              <Radio value="1">???</Radio>
              <Radio value="2">???</Radio>
              <Radio value="3">???</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'filters' && (
          <Item name="filterMethodType" label="????????????">
            <Group>
              <Radio value="1">???????????????</Radio>
              <Radio value="2">???????????????</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'filters' && (
          <Item
            label="????????????"
            shouldUpdate={(prev, next) => prev?.filterMethodType !== next?.filterMethodType}
          >
            {({ getFieldValue }) => {
              const filterMethodType = getFieldValue('filterMethodType');

              return (
                <Row gutter={8}>
                  {filterMethodType === '1' && (
                    <>
                      <Col span={6}>
                        <Item name="conditionFilterType" noStyle>
                          <Select options={conditionFilterTypeOptions} />
                        </Item>
                      </Col>
                      <Col span={18}>
                        <Item name="conditionFilterValue" noStyle>
                          <Input placeholder="?????????" autoComplete="off" />
                        </Item>
                      </Col>
                    </>
                  )}
                  {filterMethodType === '2' && (
                    <>
                      <Col span={6}>
                        <Item name="enumFilterType" noStyle>
                          <Select options={enumFilterTypeOptions} />
                        </Item>
                      </Col>
                      <Col span={18}>
                        <Item
                          noStyle
                          shouldUpdate={(prev, next) => prev?.enumFilterType !== next?.enumFilterType}
                        >
                          {({ getFieldValue }) => {
                            const enumFilterType = getFieldValue('enumFilterType');

                            return enumFilterType === '1' ? (
                              <Item name="enumFilterValue" noStyle>
                                <Select
                                  allowClear
                                  showSearch
                                  filterOption
                                  optionFilterProp="label"
                                  placeholder="?????????"
                                  options={filterValues}
                                />
                              </Item>
                            ) : (
                              <Item name="enumFilterValues" noStyle>
                                <Select
                                  allowClear
                                  showArrow
                                  maxTagCount={1}
                                  filterOption
                                  optionFilterProp="label"
                                  placeholder="?????????"
                                  mode="multiple"
                                  options={filterValues}
                                />
                              </Item>
                            )
                          }}
                        </Item>
                      </Col>
                    </>
                  )}
                </Row>
              )
            }}
          </Item>
        )}
      </Form>
    </Modal>
  );
}

export default FieldSetter;

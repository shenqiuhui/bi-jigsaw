import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, Radio, Select, Row, Col } from 'antd';
import { dataSettingConfig } from '@/core/register';
import { getFilterSelectList } from '@/service/apis/dashboard';
import { IDataSetting, IDragItem, IOption, IFieldData } from '@/core/render-engine/types';
import { ratioAggregatefuncOptions, formatTypeOptions, conditionFilterTypeOptions, enumFilterTypeOptions } from './config';

interface IFieldSetterProps {
  widgetId?: string;
  planId: number;
  type: string;
  data: IDataSetting | IDragItem;
  fields: IFieldData[];
  visible: boolean;
  droppableId: string;
  index: number;
  onVisibleChange?: (visible: boolean) => void;
  onFieldInfoSave?: ((field: IDataSetting | IDragItem, droppableId: string, index: number) => void) | undefined;
}

const { Item, useForm } = Form;
const { Group } = Radio;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const FieldSetter: React.FC<IFieldSetterProps> = (props) => {
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
  console.log('%c 🍪 data: ', 'font-size:20px;background-color: #42b983;color:#fff;', data);


  const [form] = useForm();
  const [filterValues, setFilterValues] = useState<IOption[]>([]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      title={`设置字段(${data?.field})`}
      destroyOnClose
      keyboard
      width={800}
      visible={visible}
      maskClosable={false}
      onCancel={() => onVisibleChange?.(false)}
      onOk={handleSave}
    >
      <Form
        form={form}
        initialValues={data}
        {...formLayout}
      >
        <Item label="原字段">
          <span>{data?.field}</span>
        </Item>
        {droppableId !== 'filters' && (
          <Item name="rename" label="重命名">
            <Input placeholder="请输入" autoComplete="off" />
          </Item>
        )}
        {droppableId !== 'filters' && (
          <Item name="align" label="对齐方式">
            <Group>
              <Radio value="left">左对齐</Radio>
              <Radio value="center">居中</Radio>
              <Radio value="right">右对齐</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'indicators' && (
          <Item name="aggregatefunc" label="聚合方式">
            <Group>
              <Radio value="sum">求和</Radio>
              <Radio value="avg">平均值</Radio>
              <Radio value="count">计数</Radio>
              <Radio value="count-distinct">重排计数</Radio>
              <Radio value="group-ratio">组内做比</Radio>
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
                <Item label="组内做比">
                  <Row gutter={8}>
                    <Col span={4}>
                      <Item name="ratioNumeratorAggregatefunc" noStyle>
                        <Select options={ratioAggregatefuncOptions} />
                      </Item>
                    </Col>
                    <Col span={7}>
                      <Item
                        label="分子字段"
                        name="ratioNumeratorField"
                        rules={[{ required: true, message: '请选择分子字段' }]}
                        noStyle
                      >
                        <Select
                          allowClear
                          placeholder="请选择分子"
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
                        label="分母字段"
                        name="ratioDenominatorField"
                        rules={[{ required: true, message: '请选择分母字段' }]}
                        noStyle
                      >
                        <Select
                          allowClear
                          placeholder="请选择分母"
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
          <Item name="formatType" label="数据格式化">
            <Select options={formatTypeOptions} />
          </Item>
        )}
        {droppableId !== 'filters' && (
          <Item name="order" label="排序">
            <Group>
              <Radio value="none">不排序</Radio>
              <Radio value="asc">升序</Radio>
              <Radio value="desc">降序</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'indicators' && type === 'complex' && (
          <Item name="showType" label="展示形式">
            <Group>
              <Radio value="1">线</Radio>
              <Radio value="2">柱</Radio>
              <Radio value="3">面</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'filters' && (
          <Item name="filterMethodType" label="过滤方式">
            <Group>
              <Radio value="1">按条件过滤</Radio>
              <Radio value="2">按枚举过滤</Radio>
            </Group>
          </Item>
        )}
        {droppableId === 'filters' && (
          <Item
            label="过滤条件"
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
                          <Input placeholder="请输入" autoComplete="off" />
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
                                  placeholder="请选择"
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
                                  placeholder="请选择"
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

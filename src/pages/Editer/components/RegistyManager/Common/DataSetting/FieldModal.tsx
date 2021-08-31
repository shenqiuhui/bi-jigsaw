import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, Select, Row, Col } from 'antd';
import { IDataSetting, IDragItem } from '@/store/types';
import { getFilterSelectList } from '@/service/dashboardApi';
import { IOption } from '../../../../types';

interface IFieldModalProps {
  widgetId?: string;
  planId: number;
  type: string;
  data: IDataSetting | IDragItem;
  visible: boolean;
  droppableId: string;
  index: number;
  onVisibleChange?: (visible: boolean) => void;
  onFieldInfoSave?: ((field: IDataSetting | IDragItem, droppableId: string, index: number) => void) | undefined;
}

const { Item, useForm } = Form;
const { Group } = Radio;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formatTypeOptions = [
  { value: '1', label: '自动' },
  { value: '2', label: '整数' },
  { value: '3', label: '保留1位小数' },
  { value: '4', label: '保留2位小数' },
  { value: '5', label: '百分比' },
  { value: '6', label: '百分比1位小数' },
  { value: '7', label: '百分比2位小数' }
];

const conditionFilterTypeOptions = [
  { value: '1', label: '等于' },
  { value: '2', label: '大于' },
  { value: '3', label: '大于等于' },
  { value: '4', label: '小于' },
  { value: '5', label: '小于等于' },
  { value: '6', label: '包含' },
  { value: '7', label: '不包含' },
  { value: '8', label: '开头是' },
  { value: '9', label: '结尾是' }
];

const enumFilterTypeOptions = [
  { value: '1', label: '单选' },
  { value: '2', label: '多选' }
];

const FieldModal: React.FC<IFieldModalProps> = (props) => {
  const {
    planId,
    widgetId,
    index,
    type,
    data,
    visible,
    droppableId,
    onVisibleChange,
    onFieldInfoSave
  } = props;

  const [form] = useForm();
  const [filterValues, setFilterValues] = useState<IOption[]>([]);

  const handleSave = () => {
    const formValues = form.getFieldsValue(Object.keys(data));
    onFieldInfoSave?.(formValues, droppableId, index);
    onVisibleChange?.(false);
  }

  const fetchFilterSelectList = async () => {
    try {
      const res: any = await getFilterSelectList({
        api: '/api/datausage/getDashBoardModuleData',
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
            </Group>
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

export default FieldModal;

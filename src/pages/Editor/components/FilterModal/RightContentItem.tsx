import React, { memo, useState, useMemo, useCallback } from 'react';
import { Button, Table, Form, Radio, Tooltip } from 'antd';
import { find } from 'lodash'
import Register, { widgetMap, filterComponentMap, selectDataSource } from '@/core/register';
import { IWidget } from '@/store/types';
import { IListRecord, DefaultValueType } from '@/types';
import Container from './Container';
import ColumnSelect from './ColumnSelect';

interface IRightContentItem {
  data: IListRecord;
  activeId: string;
  widgets?: IWidget[];
  onClear?: (id: string) => void;
  onFieldChange?: (id: string, widgetId: string, planId: number, field: string) => void;
  onCheckedWidgetsChange?: (id: string, keys: React.Key[]) => void;
  onFilterItemTypeChange?: (id: string, value: string) => void;
  onDefaultValueChange?: (id: string, value: DefaultValueType) => void;
  onDateRangeTypeChange?: (id: string, value: string) => void;
  onDateRangeDynamicValueChange?: (id: string, value: DefaultValueType) => void;
}

const { Item } = Form;
const { hasComponent } = Register;
const { Group } = Radio;

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};

const dynamicEnumList = [
  { value: 'yesterday', label: '昨天' },
  { value: '7_days_ago', label: '近7天' },
  { value: '14_days_ago', label: '近14天' },
  { value: '30_days_ago', label: '近30天' }
];

const RightContentItem: React.FC<IRightContentItem> = memo((props) => {
  const {
    data,
    activeId,
    widgets,
    onClear,
    onFieldChange,
    onCheckedWidgetsChange,
    onFilterItemTypeChange,
    onDefaultValueChange,
    onDateRangeTypeChange,
    onDateRangeDynamicValueChange
  } = props;

  const [type, setType] = useState(data?.filterItemType as string);

  // 展平 widgets 去除 tabs 类型组件
  const flatWidgets = useCallback((widgets: IWidget[] = [], result: IWidget[] = []) => {
    for (let i = 0; i < widgets?.length; i++) {
      const outerWidget: IWidget = widgets[i];

      if (!widgetMap?.[outerWidget?.type]?.showInFilter) {
        continue;
      }

      if (outerWidget?.type === 'tabs') {
        const tabs = outerWidget?.tabs || [];

        if (tabs?.length > 0) {
          for (let j = 0; j < tabs?.length; j++) {
            const tab = tabs[j];

            if (tab?.widgets && tab?.widgets?.length > 0) {
              result.concat(flatWidgets(tab?.widgets, result));
            }
          }
        }
      } else {
        result?.push(outerWidget);
      }
    }

    return result;
  }, []);

  // 组件字段变更
  const handleSelectChange = useCallback((id: string, widgetId: string, planId: number, field: string) => {
    onFieldChange?.(id, widgetId, planId, field);
  }, [onFieldChange]);

  // 选中组件变更
  const handleSelectKeysChange = (id: string, keys: React.Key[]) => {
    onCheckedWidgetsChange?.(id, keys);
  }

  // 组件类型变更
  const handleTypeChange = (value: string) => {
    setType(value);
    onFilterItemTypeChange?.(data?.id, value);
    onDefaultValueChange?.(data?.id, filterComponentMap?.[value]?.emptyValue);
    onDateRangeDynamicValueChange?.(data?.id, 'yesterday');
  }

  // 默认值变更
  const handleDefaultValueChange = (value: DefaultValueType) => {
    onDefaultValueChange?.(data?.id, value);
  }

  // 日期类型变化
  const handleDateRangeTypeChange = (value: string) => {
    onDateRangeTypeChange?.(data?.id, value);
  }

  // 日期动态默认值变化
  const handleDateRangeDynamicValueChange = (value: string) => {
    onDateRangeDynamicValueChange?.(data?.id, value);
  }

  const tableDataSource = useMemo<IWidget[]>(() => {
    return flatWidgets(widgets);
  }, [flatWidgets, widgets]);

  const columns = useMemo(() => ([
    {
      title: '图表名称',
      dataIndex: 'setting.style.title.',
      width: 100,
      ellipsis: true,
      render: (_text: string, record: IWidget) => {
        return (
          <Tooltip
            placement="topLeft"
            title={record?.settings?.style?.title}
          >
            {record?.settings?.style?.title}
          </Tooltip>
        );
      }
    },
    {
      title: '数据查询',
      dataIndex: 'settings.data.planName',
      width: 140,
      ellipsis: true,
      render: (_text: string, record: IWidget) => {
        return (
          <Tooltip
            placement="topLeft"
            title={record?.settings?.data?.planName}
          >
            {record?.settings?.data?.planName}
          </Tooltip>
        );
      }
    },
    {
      title: '字段',
      dataIndex: 'address',
      render: (_text: string, record: IWidget) => (
        <ColumnSelect
          value={find(data?.widgetFieldList, ['widgetId', record?.id])?.field as string}
          planId={record?.settings?.data?.planId as number}
          onChange={(field) => handleSelectChange(
            data?.id,
            record?.id,
            record?.settings?.data?.planId as number,
            field
          )}
        />
      )
    }
  ]), [data?.id, data?.widgetFieldList, handleSelectChange]);

  const renderOperator = () => (
    <Button
      className="operate-clear"
      type="link"
      onClick={() => onClear?.(data?.id)}
    >
      清空
    </Button>
  );

  return (
    <>
      {activeId === data?.id && (
        <div className="active-content" key={data?.id}>
          <Container
            border="none"
            title="关联图表及字段"
            width="50%"
            renderOperator={renderOperator}
          >
            <Table
              size="middle"
              rowKey="id"
              columns={columns}
              dataSource={tableDataSource}
              pagination={false}
              rowSelection={{
                selectedRowKeys: data?.checkedWidgets,
                onChange: (keys) => handleSelectKeysChange(data?.id, keys)
              }}
            />
          </Container>
          <Container
            border="left"
            title="查询组件配置"
            width="50%"
          >
            <Form { ...formLayout }>
              {hasComponent('filters', 'select')
                && find(selectDataSource, ['value', data?.filterItemType])
                && (
                  <Item label="组件类型">
                    {filterComponentMap?.select?.component?.({
                      width: '100%',
                      value: data?.filterItemType,
                      dataSource: selectDataSource,
                      onChange: handleTypeChange
                    })}
                  </Item>
                )}
              {hasComponent('filters', type)
                && filterComponentMap?.[type]?.hasDefaultValue
                && data?.filterItemType !== 'date-range'
                && (
                  <Item label="默认值">
                    {filterComponentMap?.[type]?.component?.({
                      ...filterComponentMap?.[type]?.props,
                      ...['select', 'select-multiple'].includes(type) ? {
                        widgetFieldList: data?.widgetFieldList,
                        checkedWidgets: data?.checkedWidgets
                      } : {},
                      width: '100%',
                      value: data?.defaultValue,
                      onChange: handleDefaultValueChange
                    })}
                  </Item>
                )}
              {data?.filterItemType === 'date-range' && (
                <Item label="日期类型">
                  <Group size="small"
                    value={data?.dateRangeType}
                    onChange={(event) => {
                      handleDateRangeTypeChange(event?.target?.value);
                    }}
                  >
                    <Radio value="static">静态</Radio>
                    <Radio value="dynamic">动态</Radio>
                  </Group>
                </Item>
              )}
              {data?.dateRangeType === 'static'
                && data?.filterItemType === 'date-range'
                && hasComponent('filters', 'date-range')
                && filterComponentMap?.['date-range']?.hasDefaultValue
                && (
                  <Item label="默认值">
                    {filterComponentMap?.['date-range']?.component?.({
                      ...filterComponentMap?.['date-range']?.props,
                      preset: false,
                      width: '100%',
                      value: data?.defaultValue,
                      onChange: handleDefaultValueChange
                    })}
                  </Item>
                )}
              {data?.dateRangeType === 'dynamic'
                && data?.filterItemType === 'date-range'
                && hasComponent('filters', 'select')
                && (
                  <Item label="默认值">
                    {filterComponentMap?.select?.component?.({
                      width: '100%',
                      value: data?.dateRangeDynamicValue,
                      dataSource: dynamicEnumList,
                      onChange: handleDateRangeDynamicValueChange
                    })}
                  </Item>
                )}
            </Form>
          </Container>
        </div>
      )}
    </>
  );
});

export default RightContentItem;

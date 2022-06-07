import { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { Form, Button } from 'antd';
import { useUpdateEffect } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import { omit, throttle } from 'lodash';
import Register, { filterComponentMap } from '@/core/register';
import FilterSetter from '../FilterSetter';
import { IFilterForm, IFilterCondition, IPageConfig } from '../../types';

import './index.less'

interface IFilterProps {
  isEdit: boolean;
  pageConfig: IPageConfig;
  initialValues: IFilterForm | undefined;
  onSearch?: (form: IFilterForm) => void;
  onFilterConfigSubmit?: () => void;
}

const { Item, useForm } = Form;
const { hasComponent } = Register;

const Filter: React.FC<IFilterProps> = memo((props) => {
  const { isEdit, initialValues = {}, pageConfig, onSearch, onFilterConfigSubmit, ...otherProps } = props;

  const [visible, setVisible] = useState(false);
  const [conditionSaved, setConditionSaved] = useState(false);
  const [form] = useForm();

  const conditions = useMemo<IFilterCondition[]>(() => {
    return pageConfig?.filters?.conditions
      ?.map((condition) => omit(condition, ['initialValue']))
      ?.filter((condition) => hasComponent('filters', condition?.type))
      || [];
  }, [pageConfig]);

  const handleFinish = useCallback((values: IFilterForm) => {
    onSearch?.(values);
  }, [onSearch]);

  const handleConditionSaved = () => {
    setConditionSaved(true);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFinishThrottle = useCallback(throttle(handleFinish, 600), [handleFinish]);

  const handleFinishFailed = (errorInfo: any) => {
    console.log('errorInfo', errorInfo);
  }

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
  }

  // 阻止事件冒泡
  const handleStopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  }

  useUpdateEffect(() => {
    if (conditionSaved) {
      onFilterConfigSubmit?.();
      setConditionSaved(false);
    }
  }, [conditionSaved]);

  useUpdateEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <div className="filter-container" onClick={handleStopPropagation}>
      <Form
        layout="inline"
        form={form}
        initialValues={initialValues}
        onFinish={handleFinishThrottle}
        onFinishFailed={handleFinishFailed}
      >
        {conditions?.map((condition) => {
          const { type, fieldValue, fieldName, ...otherProps } = condition;
          const customProps = filterComponentMap?.[type]?.props;

          return (
            <Item
              className="filter-item"
              key={fieldValue}
              name={fieldValue}
              label={fieldName}
            >
              {filterComponentMap?.[type]?.component?.(Object.assign(
                customProps,
                ['select', 'select-multiple', 'date-range'].includes(type) ? otherProps : {}
              ))}
            </Item>
          );
        })}
        {isEdit && (
          <Item>
            <Button
              className="add-filter"
              type="primary"
              onClick={() => handleVisibleChange(true)}
            >
              <PlusOutlined />
            </Button>
          </Item>
        )}
        {!!conditions.length && (
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        )}
      </Form>
      {visible && (
        <FilterSetter
          visible={visible}
          pageConfig={pageConfig}
          onVisibleChange={handleVisibleChange}
          onConditionSaved={handleConditionSaved}
          {...otherProps}
        />
      )}
    </div>
  );
});

export default Filter;

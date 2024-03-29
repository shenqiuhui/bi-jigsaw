import { memo, useState, useMemo, useCallback } from 'react';
import { Form, Button } from 'antd';
import { useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { omit, throttle } from 'lodash-es';
import { PlusOutlined } from '@ant-design/icons';
import { useComponent } from '@/core/register';
import FilterSetter from '../FilterSetter';
import { FilterFormType, FilterConditionType, PageConfigType } from '../../types';

import './index.less'

interface FilterProps {
  isEdit: boolean;
  pageConfig: PageConfigType;
  initialValues: FilterFormType | undefined;
  onSearch?: (form: FilterFormType) => void;
  onFilterConfigSubmit?: () => void;
}

const { Item, useForm } = Form;

const Filter: React.FC<FilterProps> = memo((props) => {
  const { isEdit, initialValues = {}, pageConfig, onSearch, onFilterConfigSubmit, ...otherProps } = props;

  const [filterComponentMap, { hasComponent }] = useComponent('filters');
  const [visible, setVisible] = useState(false);
  const [conditionSaved, setConditionSaved] = useState(false);
  const [form] = useForm();

  const conditions = useMemo<FilterConditionType[]>(() => {
    return pageConfig?.filters?.conditions
      ?.map((condition) => omit(condition, ['initialValue']))
      ?.filter((condition) => hasComponent('filters', condition?.type))
      || [];
  }, [pageConfig]);

  const handleFinish = useCallback((values: FilterFormType) => {
    onSearch?.(values);
  }, [onSearch]);

  const handleConditionSaved = () => {
    setConditionSaved(true);
  }

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
    <div
      className={classNames({
        'filter-container': true,
        'light-theme-filter-container': pageConfig?.theme === 'light',
        'dark-theme-filter-container': pageConfig?.theme === 'dark'
      })}
      onClick={handleStopPropagation}
    >
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
      <FilterSetter
        visible={visible}
        pageConfig={pageConfig}
        onVisibleChange={handleVisibleChange}
        onConditionSaved={handleConditionSaved}
        {...otherProps}
      />
    </div>
  );
});

export default Filter;

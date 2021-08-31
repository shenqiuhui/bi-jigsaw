import React, { memo, useState, useMemo, useEffect } from 'react';
import { Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { omit, omitBy, isNil } from 'lodash';
import { IFilterForm, IFilterCondition, IPageConfig } from '@/store/types';
import FilterModal from '../FilterModal';
import Register, { filterComponentMap } from '../../register';

import './index.less'

interface IFilterProps {
  isEdit: boolean;
  pageConfig: IPageConfig;
  initialValues: IFilterForm | undefined;
  onSearch?: (form: IFilterForm) => void;
}

const { Item, useForm } = Form;
const { hasComponent } = Register;

const Filter: React.FC<IFilterProps> = memo((props) => {
  const { isEdit, initialValues = {}, pageConfig, onSearch, ...otherProps } = props;

  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const conditions = useMemo<IFilterCondition[]>(() => {
    return pageConfig?.filters?.conditions
      ?.map((condition) => omit(condition, ['initialValue']))
      ?.filter((condition) => hasComponent('filters', condition?.type))
      || [];
  }, [pageConfig]);

  const handleFinish = (values: IFilterForm) => {
    onSearch?.(omitBy(values, isNil));
  }

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

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <div className="filter-container" onClick={handleStopPropagation}>
      <Form
        layout="inline"
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
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
                ['select', 'select-multiple'].includes(type) ? otherProps : {}
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
          <Button type="primary" htmlType="submit">查询</Button>
        )}
      </Form>
      <FilterModal
        visible={visible}
        pageConfig={pageConfig}
        onVisibleChange={handleVisibleChange}
        {...otherProps}
      />
    </div>
  );
});

export default Filter;

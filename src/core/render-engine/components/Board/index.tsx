import { memo, forwardRef, useState, useCallback } from 'react';
import { useDeepCompareEffect } from 'ahooks';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import classNames from 'classnames';
import Filter from '../Filter';
import Gird from '../Grid';
import { FilterFormType, RenderEngineType, GridRefType } from '../../types';

import './index.less';

interface BoardProps extends RenderEngineType {};
interface BoardRefs extends GridRefType {};

const Board = memo(forwardRef<BoardRefs, BoardProps>((props, ref) => {
  const {
    isEdit = false,
    config,
    selectedWidgetId,
    onWidgetSelect,
    onWidgetsUpdate,
    onPageConfigUpdate,
    onDataSettingChange,
    onStyleSettingChange,
    ...otherProps
  } = props;

  const [formValues, setFormValues] = useState<FilterFormType>({});

  const handleSearch = useCallback((form: FilterFormType) => {
    setFormValues(form);
  }, []);

  useDeepCompareEffect(() => {
    const initialValues = config?.filters?.conditions?.reduce((result, { fieldValue, initialValue }) => {
      return (result[fieldValue] = initialValue, result);
    }, {} as FilterFormType);

    setFormValues(initialValues);
  }, [config?.filters?.conditions]);

  return (
    <div
      id="widgets-viewport"
      className={classNames({
        'render-engine-container': true,
        'light-theme-render-engine-container': config?.theme === 'light',
        'dark-theme-render-engine-container': config?.theme === 'dark',
      })}
    >
      {!isEmpty(config?.filters?.conditions) || !isEmpty(config?.widgets) ? (
        <div className="board-container">
          {!(!isEdit && isEmpty(config?.filters?.conditions)) && (
            <Filter
              isEdit={isEdit}
              initialValues={formValues}
              pageConfig={config}
              onSearch={handleSearch}
              {...otherProps}
            />
          )}
          <div className="components-container">
            <Gird
              ref={ref}
              isEdit={isEdit}
              pageConfig={config}
              widgets={config?.widgets}
              filterValues={formValues}
              selectedWidgetId={selectedWidgetId}
              onWidgetSelect={onWidgetSelect}
              onWidgetsUpdate={onWidgetsUpdate}
              onPageConfigUpdate={onPageConfigUpdate}
              onDataSettingChange={onDataSettingChange}
              onStyleSettingChange={onStyleSettingChange}
            />
          </div>
        </div>
      ) : (
        <div className="page-no-data">
          <Empty description="仪表板暂无数据" />
        </div>
      )}
    </div>
  );
}));

export default Board;

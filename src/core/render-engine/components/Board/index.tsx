import { memo, forwardRef, useState, useEffect, useCallback } from 'react';
import { Empty } from 'antd';
import { isEmpty } from 'lodash';
import { useMount } from 'ahooks';
import { IFilterForm, IRenderEngine, IGridRef } from '@/types';
import Filter from '../Filter';
import Gird from '../Grid';

import './index.less';

interface IBoardProps extends IRenderEngine {};
interface IBoardRefs extends IGridRef {};

const Board = memo(forwardRef<IBoardRefs, IBoardProps>((props, ref) => {
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

  const [formValues, setFormValues] = useState<IFilterForm>({});

  const handleSearch = useCallback((form: IFilterForm) => {
    setFormValues(form);
  }, []);

  useMount(() => {
    const initialValues = config?.filters?.conditions?.reduce((result, { fieldValue, initialValue }) => {
      return (result[fieldValue] = initialValue, result);
    }, {} as IFilterForm);

    setFormValues(initialValues);
  });

  return (
    <div id="widgets-viewport" className="render-engine-container">
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

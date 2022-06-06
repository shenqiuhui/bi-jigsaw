import { useState, useEffect, useCallback, useMemo } from 'react';
import { Select } from 'antd';
import { getFilterSelectList } from '@/service/apis/dashboard';
import { IOption, IWidgetField } from '@/core/render-engine/types';
import { ISelectProps } from '../types';

const SelectItem: React.FC<ISelectProps> = (props) => {
  const {
    api,
    method,
    dataSource,
    widgetFieldList,
    checkedWidgets,
    width = 200,
    ...otherProps
  } = props;

  const [options, setOptions] = useState<IOption[]>([]);

  const filterWidgetFieldList = useMemo<IWidgetField[]>(() => {
    return widgetFieldList?.filter((item) => checkedWidgets?.includes(item?.widgetId) && item?.field);
  }, [widgetFieldList, checkedWidgets]);

  const fetchOptions = useCallback(async () => {
    try {
      const data: any = await getFilterSelectList({
        api,
        method,
        params: {
          widgetFieldList: filterWidgetFieldList
        },
      });
      setOptions(data);
    } catch (err) {}
  }, [api, method, filterWidgetFieldList]);

  useEffect(() => {
    if (!dataSource) {
      fetchOptions();
    } else {
      setOptions(dataSource);
    }
  }, [dataSource]);

  return (
    <Select style={ width ? { width } : {} } options={options} {...otherProps} />
  );
}

export default SelectItem;

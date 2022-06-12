import { memo } from 'react';
import { Empty } from 'antd';
import ConditionInfo from './ConditionInfo';
import { WidgetType, ListRecordType, DefaultValueType } from '../../types';

interface ConditionContentProps {
  data: ListRecordType[];
  activeId: string;
  widgets?: WidgetType[];
  onClear?: (id: string) => void;
  onFieldChange?: (id: string, widgetId: string, planId: number, field: string) => void;
  onCheckedWidgetsChange?: (id: string, keys: React.Key[]) => void;
  onFilterItemTypeChange?: (id: string, value: string) => void;
  onDefaultValueChange?: (id: string, value: DefaultValueType) => void;
  onDateRangeTypeChange?: (id: string, value: string) => void;
  onDateRangeDynamicValueChange?: (id: string, value: DefaultValueType) => void;
  onPresetShortcutsChange?: (id: string, value: React.Key[]) => void;
}

const ConditionContent: React.FC<ConditionContentProps> = memo((props) => {
  const { data, ...otherProps } = props;

  return (
    <div className="condition-content-container">
      {data?.length ? (
        <>
          {data?.map(item => (
            <ConditionInfo key={item?.id} data={item} {...otherProps} />
          ))}
        </>
      ) : (
        <div className="condition-content-no-data">
          <Empty description="暂无查询条件" />
        </div>
      )}
    </div>
  );
});

export default ConditionContent;

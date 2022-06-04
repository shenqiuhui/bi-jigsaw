import { memo } from 'react';
import { Empty } from 'antd';
import RightContentItem from './RightContentItem';
import { IWidget, IListRecord, DefaultValueType } from '../../types';

interface IRightContentProps {
  data: IListRecord[];
  activeId: string;
  widgets?: IWidget[];
  onClear?: (id: string) => void;
  onFieldChange?: (id: string, widgetId: string, planId: number, field: string) => void;
  onCheckedWidgetsChange?: (id: string, keys: React.Key[]) => void;
  onFilterItemTypeChange?: (id: string, value: string) => void;
  onDefaultValueChange?: (id: string, value: DefaultValueType) => void;
  onDateRangeTypeChange?: (id: string, value: string) => void;
  onDateRangeDynamicValueChange?: (id: string, value: DefaultValueType) => void;
  onPresetShortcutsChange?: (id: string, value: React.Key[]) => void;
}

const RightContent: React.FC<IRightContentProps> = memo((props) => {
  const { data, ...otherProps } = props;

  return (
    <div className="active-content-container">
      {data?.length ? (
        <>
          {data?.map(item => (
            <RightContentItem key={item?.id} data={item} {...otherProps} />
          ))}
        </>
      ) : (
        <div className="active-content-no-data">
          <Empty description="暂无查询条件" />
        </div>
      )}
    </div>
  );
});

export default RightContent;

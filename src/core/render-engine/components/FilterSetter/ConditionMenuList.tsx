import { memo } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { PlusOutlined } from '@ant-design/icons';
import ConditionMenuItem from './ConditionMenuItem';
import { ListRecordType } from '../../types';

import './index.less';

interface ConditionMenuListProps {
  data: ListRecordType[];
  activeId: string;
  onAdd?: () => void;
  onEditConfirm?: (id: string, value: string) => void;
  onActiveChange?: (id: string) => void;
  onEditStatusChange?: (id: string, isEdit: boolean) => void;
  onDisableChange?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (startIndex: number, endIndex: number) => void;
}

const ConditionMenuList: React.FC<ConditionMenuListProps> = memo((props) => {
  const { data, activeId, onAdd, onReorder, ...otherProps } = props;

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    onReorder?.(source?.index, destination?.index);
  }

  return (
    <div className="list-content">
      <div className="title">
        <h2>查询条件</h2>
        <PlusOutlined className="add" onClick={() => onAdd?.()} />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {data?.map((item, index) => (
                <ConditionMenuItem
                  key={item?.id}
                  index={index}
                  item={item}
                  activeId={activeId}
                  {...otherProps}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});

export default ConditionMenuList;

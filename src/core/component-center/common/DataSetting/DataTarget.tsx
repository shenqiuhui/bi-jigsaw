import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FieldDataType, DataSettingType, DragType } from '@/core/render-engine';
import FieldItem from './FieldItem';
import FieldSetter from './FieldSetter';

import './index.less';

interface DataTargetProps {
  type: string;
  title: string;
  droppableId: string;
  planId: number;
  data: DataSettingType[];
  fields: FieldDataType[];
  onDelete?: (field: string, droppableId: string) => void;
  onFieldInfoSave?: (field: DataSettingType | DragType, droppableId: string, index: number) => void;
}

const DataTarget: React.FC<DataTargetProps> = (props) => {
  const {
    type,
    title,
    droppableId,
    data,
    fields,
    onDelete,
    onFieldInfoSave,
    ...otherProps
  } = props;

  const [visible, setVisible] = useState(false);
  const [curIndex, setCurIndex] = useState(0);
  const [curField, setCurField] = useState<DataSettingType | DragType>({} as (DataSettingType | DragType));

  const handleFieldDelete = (field: string) => {
    onDelete?.(field, droppableId);
  }

  const handleVisibleChange = (visible: boolean,) => {
    setVisible(visible);
  }

  return (
    <div className="fields-target-container">
      <h2 className="item-label">{title}</h2>
      <div className="drop-container">
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {data.length !== 0 ? data?.map((field, index) => (
                <Draggable
                  key={field?.field}
                  draggableId={`${droppableId}-${field?.field}`}
                  index={index}
                >
                  {(provided) => (
                    <FieldItem
                      className="active target-item"
                      item={field}
                      showAggregatefunc={droppableId === 'indicators'}
                      showRename={['dimensions', 'indicators', 'legends'].includes(droppableId)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onDelete={handleFieldDelete}
                      onClick={(event) => {
                        event.stopPropagation();
                        setCurIndex(index);
                        setCurField(field);
                        handleVisibleChange(true);
                      }}
                    />
                  )}
                </Draggable>
              )) : (
                <div className="tips">
                  拖动数据字段至此处
                </div>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
      {visible && (
        <FieldSetter
          data={curField}
          fields={fields}
          index={curIndex}
          type={type}
          visible={visible}
          droppableId={droppableId}
          onVisibleChange={handleVisibleChange}
          onFieldInfoSave={onFieldInfoSave}
          {...otherProps}
        />
      )}
    </div>
  );
}

export default DataTarget;

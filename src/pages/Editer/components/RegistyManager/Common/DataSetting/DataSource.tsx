import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import FieldItem from './FieldItem';
import { IFieldData } from '../../../../types';

import './index.less';

interface IDataSourceProps {
  fields: IFieldData[];
  activeField: string;
  onActiveFieldChange?: (field: string) => void;
  onClick?: () => void;
}

const DataSource: React.FC<IDataSourceProps> = (props) => {
  const { fields, activeField, onActiveFieldChange, onClick } = props;

  const handleClick = () => onClick?.();

  return (
    <div className="fields-container" onClick={handleClick}>
      {!!fields?.length && (
        <>
          <h2>维度/指标</h2>
          <Droppable droppableId="source" isDropDisabled>
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {fields?.map((field, index) => (
                  <Draggable
                    key={field?.field}
                    draggableId={field?.field}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <>
                        <FieldItem
                          className={classNames({
                            active: activeField === field?.field,
                            'hover-item': true,
                            'dragging-item': snapshot.isDragging
                          })}
                          item={field}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(event) => {
                            event.stopPropagation();
                            onActiveFieldChange?.(field?.field);
                          }}
                        />
                        {snapshot.isDragging && (
                          <FieldItem
                            className={classNames({
                              'field-item-clone': true,
                              'dragging-item': snapshot.isDragging && activeField === field?.field,
                            })}
                            item={field}
                          />
                        )}
                      </>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </>
      )}
    </div>
  );
}

export default DataSource;

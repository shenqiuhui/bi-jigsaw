import { Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { FieldDataType } from '@/core/render-engine';
import FieldItem from './FieldItem';

import './index.less';

interface DataSourceProps {
  theme?: string;
  fields: FieldDataType[];
  activeField: string;
  onActiveFieldChange?: (field: string) => void;
  onClick?: () => void;
}

const DataSource: React.FC<DataSourceProps> = (props) => {
  const { theme = 'light', fields, activeField, onActiveFieldChange, onClick } = props;

  const handleClick = () => onClick?.();

  return (
    <div className="fields-container" onClick={handleClick}>
      {!!fields?.length && (
        <>
          <h2>维度/指标</h2>
          <div className="fields-container-list">
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
                              'light-theme-active': activeField === field?.field && theme === 'light',
                              'dark-theme-active': activeField === field?.field && theme === 'dark',
                              'hover-item': true,
                              'light-theme-hover-item': theme === 'light',
                              'dark-theme-hover-item': theme === 'dark',
                              'dragging-item': snapshot.isDragging,
                              'light-theme-dragging-item': snapshot.isDragging && theme === 'light',
                              'dark-theme-dragging-item': snapshot.isDragging && theme === 'dark',
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
                                'light-theme-dragging-item': snapshot.isDragging && activeField === field?.field && theme === 'light',
                                'dark-theme-dragging-item': snapshot.isDragging && activeField === field?.field && theme === 'dark'
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
          </div>
        </>
      )}
    </div>
  );
}

export default DataSource;

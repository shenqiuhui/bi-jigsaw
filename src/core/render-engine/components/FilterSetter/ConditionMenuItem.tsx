import { memo, useRef, useEffect } from 'react';
import { Space, Input } from 'antd';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useComponent } from '@/core/register';
import { ListRecordType } from '../../types';

import './index.less';

interface ConditionMenuItemProps {
  item: ListRecordType;
  index: number;
  activeId: string;
  onEditConfirm?: (id: string, value: string) => void;
  onActiveChange?: (id: string) => void;
  onEditStatusChange?: (id: string, isEdit: boolean) => void;
  onDisableChange?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ConditionMenuItem: React.FC<ConditionMenuItemProps> = memo((props) => {
  const {
    item,
    index,
    activeId,
    onEditConfirm,
    onEditStatusChange,
    onActiveChange,
    onDisableChange,
    onDelete
  } = props;

  const [_, { hasComponent }] = useComponent('filters');

  const editRef = useRef<Input>(null);

  // 输入框失焦和按回车执行，输入为空不允许更改数据和编辑状态
  const handleConfirm = (id: string) => {
    const value = editRef?.current?.state?.value?.trim();

    if (value) {
      onEditConfirm?.(id, value);
      onEditStatusChange?.(id, false);
    } else {
      editRef?.current?.focus();
    }
  }

  // 进入编辑态输入框自动获取焦点
  useEffect(() => {
    item.isEdit && editRef?.current?.focus();
  }, [item.isEdit]);

  // 阻止事件冒泡
  const handleStopPropagation = (
    event: React.FocusEvent | React.MouseEvent,
    task?: Function,
    ...props: any
  ) => {
    event.stopPropagation();
    task?.(...props);
  }

  return (
    <Draggable key={item?.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <li
          className={classNames({
            active: activeId === item?.id || snapshot?.isDragging,
            'item-not-show': !hasComponent('filters', item?.filterItemType as string)
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onActiveChange?.(item?.id)}
        >
          {item?.isEdit ? (
            <Input
              defaultValue={item?.name}
              className="edit-input"
              placeholder="请输入名称"
              size="small"
              bordered={false}
              allowClear
              ref={editRef}
              onBlur={(event) => {
                handleStopPropagation(event, handleConfirm, item?.id)
              }}
              onPressEnter={() => handleConfirm(item?.id)}
            />
          ) : (
            <>
              <span>{item?.name}</span>
              {activeId === item?.id && (
                <Space className="operator-container" size={5}>
                  {item.isShow ? (
                    <EyeOutlined
                      className="operator"
                      onClick={(event) => {
                        handleStopPropagation(event, onDisableChange, item?.id)
                      }}
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      className="operator"
                      onClick={(event) => {
                        handleStopPropagation(event, onDisableChange, item?.id)
                      }}
                    />
                  )}
                  <EditOutlined
                    className="operator"
                    onClick={(event) => {
                      handleStopPropagation(event, onEditStatusChange, item?.id, true)
                    }}
                  />
                  <DeleteOutlined
                    className="operator"
                    onClick={(event) => {
                      handleStopPropagation(event, onDelete, item?.id)
                    }}
                  />
                </Space>
              )}
            </>
          )}
        </li>
      )}
    </Draggable>
  );
});

export default ConditionMenuItem;

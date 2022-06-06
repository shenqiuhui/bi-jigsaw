import { useRef, useEffect } from 'react';
import { Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ITab } from '@/core/render-engine/types';

import './index.less';

interface ITabCollectionItemProps {
  value: ITab;
  onChange?: (key: string, value: string) => void;
  onDelete?: (key: string) => void;
}

const TabCollectionItem: React.FC<ITabCollectionItemProps> = (props) => {
  const { value, onChange, onDelete } = props;

  const inputRef = useRef<Input>(null);

  const handleChange = (key: string, value: string) => {
    onChange?.(key, value);
  }

  const handleConfirm = () => {
    const value = inputRef?.current?.state?.value;

    if (!value) {
      inputRef?.current?.focus();
    } else {
      inputRef?.current?.blur();
    }
  }

  useEffect(() => {
    if (!value?.name) {
      inputRef?.current?.focus();
    }
  }, [value?.name]);

  return (
    <div className="tab-item" >
      <Input
        className="tab-item-input"
        size="small"
        placeholder="请输入标签页名称"
        ref={inputRef}
        value={value?.name}
        onChange={(event) => handleChange?.(value?.key, event?.target?.value)}
        onBlur={handleConfirm}
        onPressEnter={handleConfirm}
      />
      <DeleteOutlined
        className="delete-icon"
        onClick={() => onDelete?.(value?.key)}
      />
    </div>
  );
}

export default TabCollectionItem;

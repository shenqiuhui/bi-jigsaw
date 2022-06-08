import { useState } from 'react';
import { Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FieldSelector from './FieldSelector';

import './index.less';

interface IFieldCellProps {
  value: string;
  planId: number;
  onChange: (value: string) => void;
}

const { Group } = Input;

const FieldCell: React.FC<IFieldCellProps> = (props) => {
  const { value, planId, onChange } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleSave = (field: string) => {
    setIsEdit(false);
    onChange?.(field);
  }

  return (
    <Group compact>
      {isEdit ? (
        <FieldSelector
          value={value}
          planId={planId}
          onSave={handleSave}
        />
      ) : (
        <>
          <Input
            style={{ width: 'calc(100% - 32px)' }}
            placeholder="请选择"
            value={value || ''}
          />
          <Button
            icon={<EditOutlined className="field-icon" />}
            onClick={() => setIsEdit(true)}
          />
        </>
      )}
    </Group>
  );
}

export default FieldCell;

import { memo, useState, useEffect, useMemo } from 'react';
import { Select, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { getFieldList } from '@/service/apis/dashboard';
import { IFieldData } from '../../types';

interface IFieldSelectorProps {
  value: string;
  planId: number;
  onSave: (value: string) => void;
}

const FieldSelector: React.FC<IFieldSelectorProps> = memo((props) => {
  const { value, planId, onSave } = props;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<IFieldData[]>([]);
  const [curField, setCurField] = useState<string>(value);

  const fieldsOptions = useMemo(() => {
    return fields?.map(({ field, name }) => ({ value: field, label: name }));
  }, [fields]);

  // 拉取字段列表数据
  const fetchFieldList = async () => {
    setLoading(true);

    try {
      const res: any = await getFieldList({
        planId
      });
      setFields(res);
    } catch (err) {}

    setLoading(false);
    setOpen(true);
  }

  const handleChange = (field: string) => {
    setCurField(field);
  }

  const handleClick = () => {
    onSave?.(curField);
  }

  const handleDropdownVisibleChange = () => {
    setOpen((open) => !open);
  }

  useEffect(() => {
    fetchFieldList();
  }, []);

  return (
    <>
      <Select
        placeholder="请选择"
        style={{ width: 'calc(100% - 32px)' }}
        defaultValue={value}
        loading={loading}
        open={open}
        allowClear
        options={fieldsOptions}
        onChange={handleChange}
        onDropdownVisibleChange={handleDropdownVisibleChange}
      />
      <Button
        icon={<CheckOutlined className="field-icon" />}
        onClick={handleClick}
      />
    </>
  );
});

export default FieldSelector;

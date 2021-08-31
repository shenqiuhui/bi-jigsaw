import React, { useState, useEffect, useMemo } from 'react';
import { Select } from 'antd';
import { getFieldList } from '@/service/dashboardApi';
import { IFieldData } from '../../types';

interface IColumSelectProps {
  value: string;
  planId: number;
  onChange: (value: string) => void;
}

const ColumnSelect: React.FC<IColumSelectProps> = (props) => {
  const { value, planId, onChange } = props;

  const [fields, setFields] = useState<IFieldData[]>([]);

  const fieldsOptions = useMemo(() => {
    return fields.map(({ field, name }) => ({ value: field, label: name }));
  }, [fields]);

  // 拉取字段列表数据
  const fetchFieldList = async () => {
    try {
      const res: any = await getFieldList({
        planId
      });
      setFields(res);
    } catch (err) {}
  }

  useEffect(() => {
    fetchFieldList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      placeholder="请选择"
      style={{ width: 100 }}
      value={value}
      allowClear
      onChange={onChange}
      options={fieldsOptions}
    />
  );
}

export default ColumnSelect;

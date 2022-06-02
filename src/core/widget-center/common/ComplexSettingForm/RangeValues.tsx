import React, { useCallback } from 'react';
import { InputNumber, message } from 'antd';

import './index.less';

interface IRangeValuesProps {
  value?: number[];
  onChange?: (values: (number | null)[]) => void;
}

const RangeValues: React.FC<IRangeValuesProps> = (props) => {
  const { value: rangeList, onChange } = props;

  const handleChange = useCallback((value, index) => {
    const [start, end] = rangeList as number[];

    if (
      (index === 0 && value && end && value > end) ||
      (index === 1 && value && start && value < start)
    ) {
      return message.warn('最小值不能大于最大值');
    }

    const rangeListClone = Array.from(rangeList as number[]);
    rangeListClone[index] = value;

    onChange?.(rangeListClone);
  }, [onChange, rangeList]);

  return (
    <div className="range-values-container">
      <InputNumber
        placeholder="最小值，空为自动"
        value={rangeList?.[0] as number}
        onChange={(value) => handleChange(value, 0)}
      />
      <span className="number-separator">~</span>
      <InputNumber
        placeholder="最大值，空为自动"
        value={rangeList?.[1] as number}
        onChange={(value) => handleChange(value, 1)}
      />
    </div>
  );
}

export default RangeValues;

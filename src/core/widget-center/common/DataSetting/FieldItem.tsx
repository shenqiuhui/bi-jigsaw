import { forwardRef, useState, useRef, useLayoutEffect } from 'react';
import { Tooltip } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { IconFont } from '@/assets/iconfont';
import { IDataSetting, IDragItem } from '@/core/render-engine/types';

import './index.less';

interface IFieldItemProps {
  item: IDragItem | IDataSetting;
  className?: string;
  isDragging?: boolean;
  showAggregatefunc?: boolean;
  showRename?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onDelete?: (field: string) => void;
}

const FieldItem = forwardRef<any, IFieldItemProps>((props, ref) => {
  const {
    item,
    className,
    showAggregatefunc,
    showRename,
    onClick,
    onDelete,
    ...otherProps
  } = props;

  const { rename, name, aggregatefunc } = item as IDataSetting;

  const [isEllipsis, setIsEllipsis] = useState<boolean>(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // 自动设置是否出现 tooltip 溢出提示
  useLayoutEffect(() => {
    const dom = itemRef?.current;
    const clientWidth = dom?.clientWidth as number;
    const scrollWidth = dom?.scrollWidth as number;

    if (clientWidth < scrollWidth) {
      setIsEllipsis(true);
    }
  }, [item]);

  const handleClick = (event: React.MouseEvent) => onClick?.(event);

  return (
    <li
      className={className as string}
      onClick={handleClick}
      ref={ref}
      {...otherProps}
    >
      <div className="ellipsis" ref={itemRef}>
        <TableOutlined className="table-icon" />
        <Tooltip
          title={
            isEllipsis && (
              <span>
                {name}
                {showAggregatefunc && aggregatefunc && `(${aggregatefunc})`}
                {showRename && rename && `-${rename}`}
              </span>
            )
          }
        >
          <span className="field-name">
            {name}
            {showAggregatefunc && aggregatefunc && `(${aggregatefunc})`}
            {showRename && rename && `-${rename}`}
          </span>
        </Tooltip>
      </div>
      {onDelete && (
        <IconFont
          type="icon-delete"
          className="delete-icon"
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.(item?.field);
          }}
        />
      )}
    </li>
  );
});

export default FieldItem;

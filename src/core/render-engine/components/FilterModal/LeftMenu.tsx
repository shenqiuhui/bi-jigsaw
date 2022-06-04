import { memo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import LeftMenuItem from './LeftMenuItem';
import { IListRecord } from '../../types';

import './index.less';

interface ILeftMenuProps {
  data: IListRecord[];
  activeId: string;
  onAdd?: () => void;
  onEditConfirm?: (id: string, value: string) => void;
  onActiveChange?: (id: string) => void;
  onEditStatusChange?: (id: string, isEdit: boolean) => void;
  onDisableChange?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const LeftMenu: React.FC<ILeftMenuProps> = memo((props) => {
  const { data, activeId, onAdd, ...otherProps } = props;

  return (
    <div className="list-content">
      <div className="title">
        <h2>查询条件</h2>
        <PlusOutlined className="add" onClick={() => onAdd?.()} />
      </div>
      <ul>
        {data?.map((item) => (
          <LeftMenuItem
            key={item?.id}
            item={item}
            activeId={activeId}
            {...otherProps}
          />
        ))}
      </ul>
    </div>
  );
});

export default LeftMenu;

import { useState, useEffect } from 'react';
import { List, Button, Avatar } from 'antd';
import classNames from 'classnames';
import { IDashboardItem, colorList } from '@/pages/Home';

import './index.less';

interface ICustomListProps {
  loading: boolean;
  dataSource: IDashboardItem[];
  onPreview?: (spaceId: string, pageId: string) => void;
  onIframePreview?: (spaceId: string, pageId: string) => void;
  onEdit?: (spaceId: string, pageId: string) => void;
}

const { Item } = List;
const { Meta } = Item;

const CustomList: React.FC<ICustomListProps> = (props) => {
  const { loading, dataSource, onPreview, onIframePreview, onEdit } = props;
  const [page, setPage] = useState(1);

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const renderItem = (item: IDashboardItem, index: number) => (
    <Item
      actions={[
        <Button
          key="preview"
          type="link"
          size="small"
          onClick={() => onPreview?.(item?.spaceId, item?.id)}
        >
          预览
        </Button>,
        <Button
          key="iframe"
          type="link"
          size="small"
          onClick={() => onIframePreview?.(item?.spaceId, item?.id)}
        >
          iframe
        </Button>,
        <Button
          key="edit"
          type="link"
          size="small"
          onClick={() => onEdit?.(item?.spaceId, item?.id)}
        >
          编辑
        </Button>
      ]}
    >
      <Meta
        title={item?.name}
        description={item?.description}
        avatar={
          <Avatar
            style={{
              backgroundColor: `${colorList[index % colorList?.length]}`
            }}
          >
            {item?.createUser?.charAt(0)}
          </Avatar>
        }
      />
      <div>
        <div className="update-user">
          {item?.updateUser}
        </div>
        <div className="update-time">
          {item?.updateTime}
        </div>
      </div>
    </Item>
  );

  useEffect(() => {
    setPage(1);
  }, [dataSource]);

  return (
    <div
      className={classNames({
        'custom-list-wrapper': true,
        'list-empty': !dataSource?.length
      })}
    >
      <List
        className="custom-list"
        itemLayout="horizontal"
        loading={{
          size: "large",
          spinning: loading
        }}
        pagination={{
          current: page,
          pageSize: 8,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
        dataSource={dataSource}
        renderItem={renderItem}
      />
    </div>
  );
}

export default CustomList;

import { useState, useEffect } from 'react';
import { List, Button, Space, Avatar } from 'antd';
import classNames from 'classnames';
import { DashboardType, colorList } from '@/pages/Home';

import './index.less';

interface CustomListProps {
  theme?: string;
  loading: boolean;
  dataSource: DashboardType[];
  highlightRender?: (text: string) => React.ReactElement | string;
  themeTagRender?: (itemTheme: string) => React.ReactElement;
  onPreview?: (spaceId: string, pageId: string) => void;
  onIframePreview?: (spaceId: string, pageId: string, theme: string) => void;
  onEdit?: (spaceId: string, pageId: string) => void;
}

const { Item } = List;
const { Meta } = Item;

const CustomList: React.FC<CustomListProps> = (props) => {
  const {
    theme = 'light',
    loading,
    dataSource,
    highlightRender,
    themeTagRender,
    onPreview,
    onIframePreview,
    onEdit
  } = props;
  const [page, setPage] = useState(1);

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const renderItem = (item: DashboardType, index: number) => (
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
          onClick={() => onIframePreview?.(item?.spaceId, item?.id, item?.theme)}
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
        title={highlightRender?.(item?.name)}
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
      <Space size={56}>
        <div>
          <div className="create-user">
            {item?.createUser}
          </div>
          <div className="create-time">
            创建于：{item?.createTime}
          </div>
        </div>
        <div>
          <div className="update-user">
            {item?.updateUser}
          </div>
          <div className="update-time">
            更新于：{item?.updateTime}
          </div>
        </div>
        {themeTagRender?.(item?.theme)}
      </Space>
    </Item>
  );

  useEffect(() => {
    setPage(1);
  }, [dataSource]);

  return (
    <div
      className={classNames({
        'custom-list-wrapper': true,
        'list-empty': !dataSource?.length,
        'in-search': loading
      })}
    >
      <List
        className={classNames({
          'custom-list': true,
          'light-theme-custom-list': theme === 'light',
          'dark-theme-custom-list': theme === 'dark'
        })}
        itemLayout="horizontal"
        loading={{
          size: "large",
          spinning: loading
        }}
        pagination={{
          current: page,
          pageSize: 8,
          onChange: handlePageChange,
        }}
        dataSource={dataSource}
        renderItem={renderItem}
      />
    </div>
  );
}

export default CustomList;

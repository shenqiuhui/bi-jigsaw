import { List, Card, Button, Avatar, Tooltip } from 'antd';
import classNames from 'classnames';
import { IDashboardItem, colorList } from '@/pages/Home';

import './index.less';

interface ICustomCardProps {
  loading: boolean;
  dataSource: IDashboardItem[];
  onPreview?: (spaceId: string, pageId: string) => void;
  onIframePreview?: (spaceId: string, pageId: string) => void;
  onEdit?: (spaceId: string, pageId: string) => void;
}

const { Item } = List;
const { Meta } = Card;

const grid = {
  gutter: 12,
  xs: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 5
};

const CustomCard: React.FC<ICustomCardProps> = (props) => {
  const { loading, dataSource, onPreview, onIframePreview, onEdit } = props;

  const renderItem = (item: IDashboardItem, index: number) => (
    <Item>
      <Card
        size="small"
        headStyle={{ backgroundColor: '#FAFAFA' }}
        title={item?.createUser}
        extra={item?.createTime}
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
          className="card-info"
          title={
            <Tooltip title={item?.name}>
              {item?.name}
            </Tooltip>
          }
          description={
            <div>
              <div className="description">
                {item?.description}
              </div>
              <div className="update-user">
                {item?.updateUser}
              </div>
              <div className="update-time">
                更新于：{item?.updateTime}
              </div>
            </div>
          }
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
      </Card>
    </Item>
  );

  return (
    <div
      className={classNames({
        'custom-card-wrapper': true,
        'list-empty': !dataSource?.length
      })}
    >
      <List
        className="custom-card"
        grid={grid}
        loading={{
          size: "large",
          spinning: loading
        }}
        dataSource={dataSource}
        renderItem={renderItem}
      />
    </div>
  );
}

export default CustomCard;

import { List } from 'antd';
import { IDashboardItem } from '@/pages/Home';

interface ICustomListProps {
  loading: boolean;
  dataSource: IDashboardItem[];
  onPreview?: (spaceId: string, pageId: string) => void;
  onIframePreview?: (spaceId: string, pageId: string) => void;
  onEdit?: (spaceId: string, pageId: string) => void;
}

const CustomList: React.FC<ICustomListProps> = (props) => {
  const { loading, dataSource } = props;

  return (
    <List
      loading={{
        size: "large",
        spinning: loading
      }}
      dataSource={dataSource}
    />
  )
}

export default CustomList;

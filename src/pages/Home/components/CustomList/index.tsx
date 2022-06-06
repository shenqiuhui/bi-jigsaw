import { List } from 'antd';
import { IDashboardItem } from '@/pages/Home';

interface ICustomListProps {
  loading: boolean;
  dataSource: IDashboardItem[]
}

const CustomList: React.FC<ICustomListProps> = (props) => {
  const { loading, dataSource } = props;

  return (
    <List />
  )
}

export default CustomList;

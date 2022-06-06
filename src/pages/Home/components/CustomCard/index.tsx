import { List, Card } from 'antd';
import { IDashboardItem } from '@/pages/Home';

interface ICustomCardProps {
  loading: boolean;
  dataSource: IDashboardItem[]
}

const { Item } = List;

const CustomCard: React.FC<ICustomCardProps> = (props) => {
  const { loading, dataSource } = props;

  const renderItem = (item: IDashboardItem) => {
    return (
      <Item>
        <Card
          size="small"
          headStyle={{ backgroundColor: '#FAFAFA' }}
          title={item.name}
        >
          Card content
        </Card>
      </Item>
    );
  }

  return (
    <List
      grid={{ gutter: 20, column: 4 }}
      loading={loading}
      dataSource={dataSource}
      renderItem={renderItem}
    />
  );
}

export default CustomCard;

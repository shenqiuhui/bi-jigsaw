import { useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { TabType } from '@/core/render-engine';
import TabCollectionItem from './TabCollectionItem';

interface TabCollectionsProps {
  value?: TabType[];
  onChange?: (tabs: TabType[]) => void;
  validateHasEditItem?: (tabList: TabType[]) => boolean;
}

const TabCollections: React.FC<TabCollectionsProps> = (props) => {
  const { value: tabList, validateHasEditItem, onChange } = props;

  // Tabs uuid 集合，用于重复检测
  const uuidMaps = useMemo(() => {
    return tabList?.map((tab) => tab?.key) || [];
  }, [tabList]);

  const handleChange = (key: string, value: string) => {
    const newValue = tabList?.map((tab) => tab?.key === key ? { ...tab, name: value } : tab) || [];
    onChange?.(newValue);
  }

  const handleDelete = (key: string) => {
    const newValue = tabList?.filter((tab) => tab?.key !== key) || [];
    onChange?.(newValue);
  }

  const handleAdd = () => {
    const uuid = uuidv4();

    if (uuidMaps?.includes(uuid)) {
      handleAdd();
    } else {
      const newValue = cloneDeep(tabList) || [];

      if (!validateHasEditItem?.(newValue)) {
        newValue?.push({
          key: uuid,
          name: ''
        });
        onChange?.(newValue);
      }
    }
  }

  return (
    <div className="tabs-input-container-wrapper">
      {!!tabList?.length && (
        <div className="tabs-input-container">
          {tabList?.map((value) => {
            return (
              <TabCollectionItem
                key={value?.key}
                value={value}
                onChange={handleChange}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
      <Button
        className="add-tab-button"
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        新增标签
      </Button>
    </div>
  );
}

export default TabCollections;

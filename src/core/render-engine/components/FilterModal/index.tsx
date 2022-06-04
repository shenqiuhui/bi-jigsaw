import React, { memo, useState, useEffect, useMemo } from 'react';
import { Modal, Button, Space, Popconfirm, message } from 'antd';
import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Register from '@/core/register';
import { getFilterConfig, setFilterConfig, setPageConfig } from '@/service/apis/dashboard';
import { IPageConfig, IWidgetField } from '@/store/types';
import { IFilterConfig, IListRecord, DefaultValueType } from '@/types';
import LeftMenu from './LeftMenu';
import RightContent from './RightContent';

import './index.less';

interface IFilterModalProps {
  visible: boolean;
  pageConfig: IPageConfig;
  onVisibleChange?: (visible: boolean) => void;
  onFilterConfigSubmit?: (config: IFilterConfig) => void;
}

const { hasComponent } = Register;

const FilterModal: React.FC<IFilterModalProps> = memo((props) => {
  const { visible, pageConfig, onVisibleChange, onFilterConfigSubmit } = props;

  const [data, setData] = useState<IFilterConfig>({} as IFilterConfig);
  const [activeId, setActiveId] = useState(data?.list?.[0]?.id);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // 过滤器 uuid 集合，用于重复检测
  const uuidMaps = useMemo(() => {
    return data?.list?.map((item) => item.id) || [];
  }, [data?.list]);

  // 校验左侧菜单是否有编辑项
  const validateHasEditItem = (list: IListRecord[]) => {
    return list?.some((item) => item.isEdit);
  }

  // 切换选中项
  const handleActiveChange = (id: string) => {
    if (!validateHasEditItem(data?.list)) {
      setActiveId(id);
    }
  }

  // 切换启用状态
  const handleDisableChange = (id: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, isShow: !item.isShow } : item;
      });

      return { ...data, list };
    });
  }

  // 提交更改的名称
  const handleEditConfirm = (id: string, value: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, name: value } : item;
      });

      return { ...data, list };
    });
  }

  // 更改编辑状态
  const handleEditStatusChange = (id: string, isEdit: boolean) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, isEdit } : item;
      });

      return { ...data, list };
    });
  }

  // 添加项
  const handleAdd = () => {
    if (!validateHasEditItem(data?.list)) {
      const uuid = uuidv4();

      if (uuidMaps?.includes(uuid)) {
        handleAdd();
      } else {
        setData((data) => {
          const list = [
            ...data?.list || [],
            {
              id: uuid,
              name: '',
              isShow: true,
              filterItemType: 'select',
              defaultValue: null,
              checkedWidgets: [],
              widgetFieldList: [],
              dateRangeType: 'static',
              dateRangeDynamicValue: 'yesterday'
            }
          ];
          handleActiveChange(list?.[list?.length - 1]?.id);
          return { ...data, list };
        });
        handleEditStatusChange(uuid, true);
      }
    }
  }

  // 删除项
  const handleDelete = (id: string) => {
    setData((data) => {
      const list = data?.list?.filter((item) => item.id !== id);
      handleActiveChange(list?.[0]?.id);
      return { ...data, list };
    });
  }

  // 更改查询字段
  const handleFieldChange = (id: string, widgetId: string, planId: number, field: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        if (item.id === id) {
          const widgetFieldMap = item?.widgetFieldList?.reduce((map, item) => {
            return (map.set(item?.widgetId, item), map);
          }, new Map<string, IWidgetField>());

          widgetFieldMap.set(widgetId, { widgetId, planId, field });

          return { ...item, widgetFieldList: Array.from(widgetFieldMap?.values()) }
        } else {
          return item;
        }
      });
      return { ...data, list };
    });
  }

  // 更新组件勾选状态
  const handleCheckedWidgetsChange = (id: string, checkedWidgets: React.Key[]) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, checkedWidgets } : item;
      });
      return { ...data, list };
    });
  }

  // 清空
  const handleClear = (id: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, checkedWidgets: [], widgetFieldList: [] } : item;
      });
      return { ...data, list };
    });
  }

  // 更改过滤器组件类型
  const handleFilterItemTypeChange = (id: string, value: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, filterItemType: value } : item;
      });
      return { ...data, list };
    });
  }

  // 更改过滤器组件默认值
  const handleDefaultValueChange = (id: string, value: DefaultValueType) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, defaultValue: value } : item;
      });
      return { ...data, list };
    });
  }

  // 更改过滤器组件日期类型
  const handleDateRangeTypeChange = (id: string, value: string) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, dateRangeType: value } : item;
      });
      return { ...data, list };
    });
  }

  // 更改过滤器组件日期范围动态默认值
  const handleDateRangeDynamicValueChange = (id: string, value: DefaultValueType) => {
    setData((data) => {
      const list = data?.list?.map((item) => {
        return item.id === id ? { ...item, dateRangeDynamicValue: value } : item;
      });
      return { ...data, list };
    });
  }

  // 提交过滤器配置
  const handleSubmitFilterConfig = async () => {
    setSubmitLoading(true);

    try {
      const res: any = await setPageConfig(pageConfig);

      if (res?.status === 'success') {
        const list = data?.list?.map((item) => {
          const omitKeys = item?.filterItemType !== 'data-range' ? ['dateRangeType', 'dateRangeDynamicValue'] : [];
          omit(item, ['isEdit', ...omitKeys]);
        });
        await setFilterConfig({ ...data, list });
        await onFilterConfigSubmit?.(data);
        onVisibleChange?.(false);
        message.success('设置成功');
      }
    } catch (err) {}

    setSubmitLoading(false);
  }

  // 拉取过滤器配置数据
  const fetchFilterConfig = async () => {
    try {
      const res: any = await getFilterConfig({
        pageId: pageConfig?.pageId
      });

      const list = res?.list?.map((item: IListRecord) => ({ ...item, isEdit: false }));
      const filterList = list?.filter((item: IListRecord) => hasComponent('filters', item?.filterItemType as string));

      setData({ ...res, list });
      setActiveId(filterList?.[0]?.id);
    } catch (err) {}
  }

  // 页面初始化请求接口
  useEffect(() => {
    if (visible) {
      fetchFilterConfig();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      title="查询条件设置"
      wrapClassName="modal-container"
      destroyOnClose
      keyboard
      width={1200}
      visible={visible}
      maskClosable={false}
      onCancel={() => onVisibleChange?.(false)}
      footer={
        <Space size={16}>
          <Button onClick={() => onVisibleChange?.(false)}>
            取消
          </Button>
          <Popconfirm
            overlayClassName="double-submit"
            title="如果该编辑页面存在未保存的组件，提交查询条件配置同时会自动提交页面配置。"
            disabled={validateHasEditItem(data?.list)}
            onConfirm={handleSubmitFilterConfig}
          >
            <Button type="primary" loading={submitLoading}>
              保存
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <div className="list-container">
        <LeftMenu
          data={data?.list}
          activeId={activeId}
          onAdd={handleAdd}
          onEditConfirm={handleEditConfirm}
          onEditStatusChange={handleEditStatusChange}
          onActiveChange={handleActiveChange}
          onDisableChange={handleDisableChange}
          onDelete={handleDelete}
        />
        <RightContent
          data={data?.list}
          activeId={activeId}
          onClear={handleClear}
          onFieldChange={handleFieldChange}
          onCheckedWidgetsChange={handleCheckedWidgetsChange}
          onFilterItemTypeChange={handleFilterItemTypeChange}
          onDefaultValueChange={handleDefaultValueChange}
          onDateRangeTypeChange={handleDateRangeTypeChange}
          onDateRangeDynamicValueChange={handleDateRangeDynamicValueChange}
          widgets={pageConfig?.widgets}
        />
      </div>
    </Modal>
  );
});

export default FilterModal;

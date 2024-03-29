import { useState, useMemo, useEffect } from 'react';
import { Select, Input, Radio, message } from 'antd';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { findIndex, omit, cloneDeep } from 'lodash-es';
import { SearchOutlined } from '@ant-design/icons';
import { getFieldList, getPlanList } from '@/service/apis/dashboard';
import { useConfig } from '@/core/register';
import { SettingType, DragType, DataSettingType, OptionType } from '@/core/render-engine';
import DataSource from './DataSource';
import DataTarget from './DataTarget';
import ItemGroup from '../ItemGroup';
import { PlanDataType } from '../../settings';

import './index.less';
import classNames from 'classnames';

interface DataSettingDes {
  type: string;
  title: string;
}

interface DragEndInfo {
  droppableId: string;
  index: number;
}

interface DataSettingProps {
  theme?: string;
  type: string;
  pageId: string;
  widgetId: string;
  dataSetting: SettingType['data'];
  settingDes: DataSettingDes[];
  validator?: (result: DropResult) => boolean;
  onDataSettingChange?: ((dataSettings: SettingType['data']) => void) | undefined;
}

type DroppableId = 'dimensions' | 'indicators' | 'legends' | 'filters';

const { Group } = Radio;

const DataSetting: React.FC<DataSettingProps> = (props) => {
  const { theme = 'light', type, widgetId, dataSetting, settingDes, validator, onDataSettingChange, ...otherProps } = props;

  const [dataSettingConfig] = useConfig('settings');
  const [allFields, setAllFields] = useState<DragType[]>([]);
  const [fields, setFields] = useState<DragType[]>([]);
  const [plans, setPlans] = useState<PlanDataType[]>([]);
  const [activeField, setActiveField] = useState('');
  const [loading, setLoading] = useState(false);

  const settingDesFilter = useMemo(() => {
    return dataSetting?.showType === '1' ? settingDes?.filter((des) => des.type !== 'indicators') : settingDes;
  }, [dataSetting?.showType, settingDes]);

  const planOptions = useMemo(() => {
    return plans.map(({ planId, planName }) => ({ value: planId, label: planName }));
  }, [plans]);

  // 过滤维度指标
  const handleInputChange = (event: any) => {
    const searchValue = event?.target?.value;

    if (!searchValue) {
      setFields(allFields);
    } else {
      const filterFields = allFields?.filter((field) => {
        return field?.name.includes(searchValue)
          || field?.name.includes(searchValue.toLowerCase())
          || field?.name.includes(searchValue.toUpperCase())
          || field?.field.includes(searchValue)
          || field?.field.includes(searchValue.toLowerCase())
          || field?.field.includes(searchValue.toUpperCase())
      });
      setFields(filterFields);
    }
  }

  // 更改查询类型
  const handlePlanInfoChange = (planId: number, option: OptionType) => {
    const settings = cloneDeep(dataSetting);

    fetchFields(planId);
    onDataSettingChange?.({
      ...settingDes?.reduce((dataSetting, des) => {
        return (dataSetting[des?.type as DroppableId] = [], dataSetting)
      }, settings),
      planId,
      planName: option?.label,
    });
  }

  // 更改类型
  const handleShowTypeChange = (event: any) => {
    const showType = event?.target?.value;
    const settings = cloneDeep(dataSetting);

    if (showType === '1') {
      const dimensions = settings?.dimensions || [];
      const indicators = settings?.indicators || [];
      settings.dimensions = dimensions.concat(indicators);
      settings.indicators = [];
    }

    onDataSettingChange?.({
      ...settings,
      showType,
    });
  }

  // 删除事件
  const handleFieldDelete = (field: string, droppableId: string) => {
    const newData = dataSetting?.[droppableId as DroppableId]?.filter((item) => item.field !== field);
    onDataSettingChange?.({
      ...dataSetting,
      [droppableId]: newData
    });
  }

  // 保存字段信息
  const handleFieldInfoSave = (field: DataSettingType | DragType, droppableId: string, index: number) => {
    const fieldsClone = Array.from(dataSetting?.[droppableId as DroppableId] || []);
    fieldsClone.splice(index, 1, field as DataSettingType);

    onDataSettingChange?.({
      ...dataSetting,
      [droppableId]: fieldsClone
    });
  }

  // 新增
  const add = (
    source: DataSettingType[] | DragType[] = [],
    destination: DataSettingType[] = [],
    droppableSource: DragEndInfo,
    droppableDestination: DragEndInfo
  ) => {
    const destClone = Array.from(destination);
    const sourceItem = source?.[droppableSource?.index];
    const numberTypes = ['int', 'float', 'double', 'decimal'];
    const newItem = {
      ...omit(dataSettingConfig?.defaultParams, ['type']),
      ...sourceItem,
      aggregatefunc: numberTypes.includes(sourceItem?.fieldType) ? 'sum' : 'count'
    };

    destClone.splice(droppableDestination?.index, 0, newItem as DataSettingType);

    return destClone;
  }

  // 重新排序
  const reorder = (list: DataSettingType[] = [], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  // 移动
  const move = (
    source: DataSettingType[] = [],
    destination: DataSettingType[] = [],
    droppableSource: DragEndInfo,
    droppableDestination: DragEndInfo
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone?.splice(droppableSource?.index, 1);

    destClone.splice(droppableDestination?.index, 0, removed);

    return [sourceClone, destClone];
  }

  // 重复检测
  const checkUnique = (
    source: DataSettingType[] | DragType[] = [],
    checkSource: DataSettingType[] = [],
    sourceIndex: number
  ) => {
    return findIndex(checkSource, { field: source?.[sourceIndex]?.field }) !== -1;
  }

  // 互斥检测
  const checkOpposite = (
    source: DropResult['source'],
    destination: DropResult['destination'],
    dataSetting: SettingType['data'],
  ) => {
    if (['source', 'filters'].includes(source?.droppableId)) {
      const dimensions = dataSetting?.dimensions || [];
      const indicators = dataSetting?.indicators || [];
      const legends = dataSetting?.legends || [];

      const sourceData = source?.droppableId === 'source'
        ? fields
        : dataSetting?.[source?.droppableId as DroppableId];

      switch (destination?.droppableId) {
        case 'dimensions':
          return checkUnique(sourceData, indicators, source?.index)
            || checkUnique(sourceData, legends, source?.index);
        case 'indicators':
          return checkUnique(sourceData, dimensions, source?.index)
            || checkUnique(sourceData, legends, source?.index);
        case 'legends':
          return checkUnique(sourceData, dimensions, source?.index)
            || checkUnique(sourceData, indicators, source?.index);
      }
    }

    return false;
  }

  // 拖拽事件
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // 容器内部拖拽排序
    if (source?.droppableId === destination?.droppableId) {
      const newData = reorder(
        dataSetting?.[source?.droppableId as DroppableId] || [],
        source?.index,
        destination?.index
      );

      return onDataSettingChange?.({
        ...dataSetting,
        [source?.droppableId]: newData
      });
    }

    // 字段重复判断
    if (checkUnique(
      source?.droppableId === 'source' ? fields : dataSetting?.[source?.droppableId as DroppableId],
      dataSetting?.[destination?.droppableId as DroppableId],
      source?.index
    )) {
      return message.warning({ className: theme, content: '字段已存在' });
    }

    // 组件自定义条件判断
    if (validator && !validator?.(result)) {
      return;
    };

    // 指标和维度互斥判断
    if (checkOpposite(source, destination, dataSetting)) {
      return message.warning({ className: theme, content: '字段不能在指标、维度和图例中同时存在' });
    }

    // 添加和交换
    if (source?.droppableId === 'source') {
      const destData = add(
        fields,
        dataSetting?.[destination?.droppableId as DroppableId] || [],
        source,
        destination
      );

      return onDataSettingChange?.({
        ...dataSetting,
        [destination?.droppableId]: destData,
      });
    } else {
      const [sourceData, destData] = move(
        dataSetting?.[source?.droppableId as DroppableId] || [],
        dataSetting?.[destination?.droppableId as DroppableId] || [],
        source,
        destination
      );

      return onDataSettingChange?.({
        ...dataSetting,
        [source?.droppableId]: sourceData,
        [destination?.droppableId]: destData,
      });
    }
  }

  // 拉取查询条件数据
  const fetchPlans = async () => {
    setLoading(true);

    try {
      const res: any = await getPlanList({});
      setPlans(res);
    } catch (err) {}

    setLoading(false);
  };

  // 拉取字段数据
  const fetchFields = async (planId: number) => {
    try {
      const res: any = await getFieldList({
        planId
      });

      setFields(res);
      setAllFields(res);
    } catch (err) {}
  }

  useEffect(() => {
    fetchPlans();
    fetchFields(dataSetting?.planId as number);
  }, [widgetId]);

  return (
    <div className="data-setting-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="data-form">
          {type === 'table' && dataSetting?.showType && (
            <div className="data-type">
              <h2 className="item-label">类型</h2>
              <ItemGroup theme={theme}>
                <Group
                  size="small"
                  value={dataSetting?.showType}
                  onChange={handleShowTypeChange}
                >
                  <Radio value="1">明细</Radio>
                  <Radio value="2">聚合</Radio>
                </Group>
              </ItemGroup>
            </div>
          )}
          {settingDesFilter?.map((des) => (
            <DataTarget
              theme={theme}
              type={type}
              key={des?.type}
              title={des?.title}
              droppableId={des?.type}
              data={dataSetting?.[des?.type as DroppableId] || []}
              planId={dataSetting?.planId as number}
              fields={fields}
              onDelete={handleFieldDelete}
              onFieldInfoSave={handleFieldInfoSave}
              {...otherProps}
            />
          ))}
        </div>
        <div
          className={classNames({
            'data-source': true,
            'light-theme-data-source': theme === 'light',
            'dark-theme-data-source': theme === 'dark'
          })}
        >
          <Select
            className="plan-select"
            optionFilterProp="label"
            value={dataSetting?.planId as number}
            loading={loading}
            showSearch
            filterOption
            options={planOptions}
            onChange={(planId, option) => handlePlanInfoChange(planId, option as OptionType)}
          />
          <Input
            placeholder="搜索字段"
            addonAfter={<SearchOutlined />}
            onChange={handleInputChange}
          />
          <DataSource
            theme={theme}
            fields={fields}
            activeField={activeField}
            onActiveFieldChange={(field: string) => setActiveField(field)}
            onClick={() => setActiveField('')}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default DataSetting;

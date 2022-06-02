import request, { IConfig } from '../request';

// 获取表格组件数据接口
export const getTableData = (params = {}) => {
  return request.post('/api/table', params);
}

// 获取图表组件数据接口
export const getEchartData = ({ method = 'get', api, params = {} }: {
  api: string;
  method?: 'get' | 'post';
  params?: object;
}) => {
  return (request[method] as Function)(api, params);
}

// 下载组件数据
export const exportData = (params = {}) => {
  return request.post('/api/download', params, {
    resType: 1,
  } as IConfig);
}

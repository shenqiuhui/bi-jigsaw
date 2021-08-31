// import { AxiosRequestConfig } from 'axios';
import request from './request';

// 获取表格组件数据接口
export const getTableData = (params = {}) => {
  // return request.post('/getDashBoardTablesData', params);
  return request.get('/getTableData');
}

// 获取图表组件数据接口
export const getEchartsData = ({ method = 'get', api, params = {} }: {
  api: string;
  method?: 'get' | 'post';
  params?: object;
}) => {
  // return (request[method] as Function)(api, params);
  return (request.get as Function)(api, params);
}

// 下载组件数据
export const exportData = (params = {}) => {
  // return request.post('/dashBoardTablesData/download', params, {
  //   resType: 1,
  // } as AxiosRequestConfig);
  // return request.get('/dashBoardTablesData/download');
}

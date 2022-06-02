import request from '../request';

// 获取页面配置接口
export const getPageConfig = (params = {}) => {
  return request.post('/api/page', params);
};

// 设置页面配置接口
export const setPageConfig = (params = {}) => {
  return request.post('/api/save-page', params);
}

// 获取过滤器配置接口
export const getFilterConfig = (params = {}) => {
  return request.post('/api/conditions', params);
}

// 设置过滤器配置接口
export const setFilterConfig = (params = {}) => {
  return request.post('/api/save-conditions', params);
}

// 获取过滤器下拉接口
export const getFilterSelectList = ({ method = 'get', api, params = {} }: {
  api: string;
  method?: 'get' | 'post';
  params?: object;
}) => {
  return (request[method] as Function)(api, params);
}

// 获取字段列表
export const getFieldList = (params = {}) => {
  return request.post('/api/fields', params);
}

// 获取查询条件列表
export const getPlanList = (params = {}) => {
  return request.post('/api/plans', params);
}

// 校验仪表板名字唯一性
export const checkUniqueName = (params = {}) => {
  return request.post('/api/check-unique', params);
}

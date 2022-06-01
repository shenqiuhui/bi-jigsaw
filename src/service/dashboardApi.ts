import request from './core/request';

// 获取页面配置接口
export const getPageConfig = (params = {}) => {
  return request.post('/api/getPageConfig', params);
};

// 设置页面配置接口
export const setPageConfig = (params = {}) => {
  return request.post('/api/setPageConfig', params);
}

// 获取过滤器配置接口
export const getFilterConfig = (params = {}) => {
  return request.post('/api/getFilterConfig', params);
}

// 设置过滤器配置接口
export const setFilterConfig = (params = {}) => {
  return request.post('/api/setFilterConfig', params);
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
  return request.post('/api/getFields', params);
}

// 获取查询条件列表
export const getPlanList = (params = {}) => {
  return request.post('/api/getPlans', params);
}

// 校验仪表板名字唯一性
export const checkUniqueName = (params = {}) => {
  return request.post('/api/checkUniqueName', params);
}

// 校验当前用户是否有仪表板预览权限
export const checkPreviewAuth = (params = {}) => {
  return request.post('/api/checkPreviewAuth', params);
}

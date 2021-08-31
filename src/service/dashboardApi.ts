import request from './request';

// 获取页面配置接口
export const getPageConfig = (params = {}) => {
  // return request.post('/getPageConfig', params);
  return request.get('/getPageConfig');
};

// 设置页面配置接口
export const setPageConfig = (params = {}) => {
  // return request.post('/setPageConfig', params);
  return request.get('/setPageConfig');
}

// 获取过滤器配置接口
export const getFilterConfig = (params = {}) => {
  // return request.post('/getFilterConfig', params);
  return request.get('/getFilterConfig');
}

// 设置过滤器配置接口
export const setFilterConfig = (params = {}) => {
  // return request.post('/addDashBoardCondition', params);
  return request.get('/setFilterConfig');
}

// 获取过滤器下拉接口
export const getFilterSelectList = ({ method = 'get', api, params = {} }: {
  api: string;
  method?: 'get' | 'post';
  params?: object;
}) => {
  // return (request[method] as Function)(api, params);
  return (request.get as Function)(api);
}

// 获取字段列表
export const getFieldList = (params = {}) => {
  // return request.post('/getPlanIndex', params);
  return request.get('/getPlanList');
}

// 获取查询条件列表
export const getPlanList = (params = {}) => {
  // return request.post('/getPlans', params);
  return request.get('/getPlanList');
}

// 校验仪表板名字唯一性
export const checkUniqueName = (params = {}) => {
  // return request.post('/checkUniqueName', params);
  return request.get('/checkUniqueName');
}

// 校验当前用户是否有仪表板预览权限
export const checkPreviewAuth = (params = {}) => {
  // return request.post('/checkPreviewAuth', params);
  return request.get('/checkPreviewAuth');
}

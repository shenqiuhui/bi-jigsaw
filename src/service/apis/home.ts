import request from '../request';

// 获取用户信息
export const getUserInfo = (params = {}) => {
  return request.post('/api/user', params);
}

// 获取空间列表
export const getSpaceList = (params = {}) => {
  return request.post('/api/space', params);
}

// 获取仪表板列表
export const getDashboardList = (params = {}) => {
  return request.post('/api/list', params);
}

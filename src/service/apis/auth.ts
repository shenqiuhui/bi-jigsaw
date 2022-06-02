import request from '../request';

// 校验当前用户是否有仪表板预览权限
export const checkDashboardAuth = (params = {}) => {
  return request.post('/api/auth', params);
}

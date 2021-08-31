import axios from 'axios';

const instance = axios.create({
  baseURL: "/",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    return Promise.resolve({
      ...config,
      url: `http://${window.location.host}/mock${config.url}.json`
    });
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data.data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

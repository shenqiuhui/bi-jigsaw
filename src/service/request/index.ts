import axios, { AxiosRequestConfig } from 'axios';

export interface IConfig extends AxiosRequestConfig {
  resType?: number;
}

const baseURL = import.meta.env.PROD ? 'https://mock.apifox.cn/m1/1062627-0-default' : '/'

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: IConfig) => {
    if (config.resType && config.resType === 1) {
      config.responseType = "blob";
    }

    return config;
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

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import user from './slices/user';
import dashboard from './slices/dashboard';

const store = configureStore({
  reducer: combineReducers({ user, dashboard }),
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return process.env.NODE_ENV === 'development' ? defaultMiddleware.concat(logger) : defaultMiddleware
  },
});

export * from './types';
export default store;

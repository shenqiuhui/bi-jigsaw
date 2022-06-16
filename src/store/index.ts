import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import user from './slices/user';
import dashboard from './slices/dashboard';
import home from './slices/home';

const store = configureStore({
  reducer: combineReducers({ user, dashboard, home }),
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return process.env.NODE_ENV === 'development' ? defaultMiddleware.concat(logger) : defaultMiddleware
  },
});

export * from './types';
export default store;

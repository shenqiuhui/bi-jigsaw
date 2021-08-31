import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import dashboard from './slices/dashboardSlice';

const store = configureStore({
  reducer: combineReducers({ dashboard }),
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return process.env.NODE_ENV === 'development' ? defaultMiddleware.concat(logger) : defaultMiddleware
  },
});

export default store;

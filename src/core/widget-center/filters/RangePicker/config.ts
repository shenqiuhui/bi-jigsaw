import moment from 'moment';
import { IRangePreset } from '../types';

// 预置时间范围选项
export const rangeDatePreset: IRangePreset = {
  'yesterday': {
    name: '昨日',
    range: [
      moment().subtract(1, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  'this_week': {
    name: '本周',
    range: [
      moment().startOf('isoWeek'),
      moment().endOf('day')
    ]
  },
  'last_week': {
    name: '上周',
    range: [
      moment().subtract(1, 'weeks').startOf('isoWeek'),
      moment().subtract(1, 'weeks').endOf('isoWeek')
    ]
  },
  'this_month': {
    name: '本月',
    range: [
      moment().startOf('month'),
      moment().endOf('day')
    ]
  },
  'last_month': {
    name: '上月',
    range: [
      moment().subtract(1, 'months').startOf('month'),
      moment().subtract(1, 'months').endOf('month')
    ]
  },
  'this_year': {
    name: '本年',
    range: [
      moment().startOf('year'),
      moment().endOf('day')
    ]
  },
  'last_year': {
    name: '去年',
    range: [
      moment().subtract(1, 'years').startOf('year'),
      moment().subtract(1, 'years').endOf('year')
    ]
  },
  '7_days_ago': {
    name: '过去7天',
    range: [
      moment().subtract(7, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  '14_days_ago': {
    name: '过去14天',
    range: [
      moment().subtract(14, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  '30_days_ago': {
    name: '过去30天',
    range: [
      moment().subtract(30, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  '60_days_ago': {
    name: '过去60天',
    range: [
      moment().subtract(60, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  '90_days_ago': {
    name: '过去90天',
    range: [
      moment().subtract(90, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  },
  '180_days_ago': {
    name: '过去180天',
    range: [
      moment().subtract(180, 'days').startOf('day'),
      moment().subtract(1, 'days').endOf('day')
    ]
  }
};

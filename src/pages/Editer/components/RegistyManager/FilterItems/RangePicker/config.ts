import moment from 'moment';
import { IRangePreset } from '../../../../types';

// 预置时间范围选项
export const rangeDatePreset: IRangePreset = {
  '昨日': [
    moment().subtract(1, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '本周': [
    moment().startOf('isoWeek'),
    moment().endOf('day')
  ],
  '上周': [
    moment().subtract(1, 'weeks').startOf('isoWeek'),
    moment().subtract(1, 'weeks').endOf('isoWeek')
  ],
  '本月': [
    moment().startOf('month'),
    moment().endOf('day')
  ],
  '上月': [
    moment().subtract(1, 'months').startOf('month'),
    moment().subtract(1, 'months').endOf('month')
  ],
  '本年': [
    moment().startOf('year'),
    moment().endOf('day')
  ],
  '去年': [
    moment().subtract(1, 'years').startOf('year'),
    moment().subtract(1, 'years').endOf('year')
  ],
  '过去7天': [
    moment().subtract(7, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '过去14天': [
    moment().subtract(14, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '过去30天': [
    moment().subtract(30, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '过去60天': [
    moment().subtract(60, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '过去90天': [
    moment().subtract(90, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ],
  '过去180天': [
    moment().subtract(180, 'days').startOf('day'),
    moment().subtract(1, 'days').endOf('day')
  ]
};

/* eslint-disable import/prefer-default-export */
import moment from 'moment';

export const GetDiffDay = (date1, date2) => moment(date1).diff(moment(date2), 'days');

export const AddDay = (date, add) => moment(date).add(add, 'days');

export const isDateBefore = (beforeDate, date) => moment(beforeDate).isBefore(moment(date));

export const isDateAfter = (afterDate, date) => moment(afterDate).isAfter(moment(date));

import { MONTHS } from '../constants/months';

export const dateString = (date) => {
  var dateString = date.split('-');
  return MONTHS[parseInt(dateString[1]) - 1] + ' ' + dateString[2] + ', ' + dateString[0];
};

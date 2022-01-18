export const hyphenToDate = (date) => {
  return new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]).getTime();
};

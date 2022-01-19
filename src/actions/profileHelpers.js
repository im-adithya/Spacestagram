export const generateDates = (start) => {
  let dates = [];
  const date = new Date();
  date.setDate(date.getDate() - start);
  for (let i = 0; i < 18; i++) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() - 1);
  }
  return dates;
};

export const generateNS = (start) => {
  let actualNS = start + 1;
  let fiveDCodes = [];
  for (let i = 0; i < 19; i++) {
    fiveDCodes.push(actualNS);
    actualNS++;
  }
  return fiveDCodes.map((c) => c.toString().padStart(5, '0'));
};

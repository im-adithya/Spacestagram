export const generateDates = (start) => {
  let dates = [];
  const date = new Date();
  date.setDate(date.getDate() - start);
  for (let i = 0; i < 5; i++) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() - 1);
  }
  return dates;
};

export const generateES = () => {
  // For Earth
  if (localStorage.getItem('earth') === null) localStorage.setItem('earth', 0);
  const earthStart = parseInt(localStorage.getItem('earth'));
  return earthStart - 2 < 0 ? 0 : earthStart - 2;
};

export const generateNS = () => {
  // For NASA
  if (localStorage.getItem('nasa') === null) localStorage.setItem('nasa', 1);
  const nasaStart = parseInt(localStorage.getItem('nasa'));
  let actualNS = nasaStart - 2 < 0 ? 1 : nasaStart - 2;

  let fiveDCodes = [];
  for (let i = 0; i < 5; i++) {
    fiveDCodes.push(actualNS);
    actualNS++;
  }

  return { fiveDCodes: fiveDCodes.map((c) => c.toString().padStart(5, '0')), actualNS };
};

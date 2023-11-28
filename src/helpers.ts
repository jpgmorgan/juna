export const addDaysToDate = (date: Date, days: number): Date => {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const calculateDurationInDays = (durationSecs: number): number => {
  return durationSecs / 3600 / 24;
};

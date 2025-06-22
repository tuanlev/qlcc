exports.dateCompare = (date1, date2) => {



  const diffMs = date1.getTime() - date2.getTime();
  const diffMs1 = date2.getTime() - date1.getTime();

  const oneHourMs = 60 * 60 * 1000;

  if (diffMs1 >= oneHourMs) return false;
  if (date1 <= date2) return true;
  if (diffMs >= oneHourMs) return false;

  return true;
}
exports.shiftHoursToDates = (shift, baseDate = new Date()) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // zero-based
  const day = baseDate.getDate();

  const checkInDate = new Date(year, month, day, shift.checkInHour, 0, 0);
  const checkOutDate = new Date(year, month, day, shift.checkOutHour, 0, 0);

  return { checkInDate, checkOutDate };
}
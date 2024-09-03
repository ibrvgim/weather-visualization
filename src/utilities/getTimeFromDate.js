export function getTimeFromDate(date) {
  return date.toTimeString().split(' ')[0];
}

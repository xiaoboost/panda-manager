export function format(time: number) {
  const now = new Date(time);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const sec = String(now.getSeconds()).padStart(2, '0');
  const msec = String(now.getMilliseconds()).padStart(3, '0');

  return `${year}.${month}.${date} - ${hour}:${min}:${sec}:${msec}`;
}

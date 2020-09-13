export function formatCurrentDate(milliseconds): string {
  const validFormatMS = typeof 'string' ? parseInt(milliseconds, 10) : milliseconds;
  const date = new Date(validFormatMS);

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  const hours = date.getUTCHours().toString().length > 1 ? date.getUTCHours() : '0' + date.getUTCHours();
  const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds();

  return month + '/' + day + '/' +  date.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds;
}

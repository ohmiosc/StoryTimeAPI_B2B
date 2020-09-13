export function timestampWithSixDigits(): string {
  let id: string = '';
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000).toString();

  const currentDate = new Date();
  id = id + currentDate.getFullYear()
    + currentDate.getMonth()
    + currentDate.getDay()
    + currentDate.getHours()
    + currentDate.getMinutes()
    + currentDate.getSeconds()
    + currentDate.getMilliseconds()
    + randomSixDigits;

  return id;
}

export function randomUUIDV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function formatCurrentDate(milliseconds): string {
  const validFormatMS = typeof 'string' ? parseInt(milliseconds, 10) : milliseconds;
  const date = new Date(validFormatMS);

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  const hours = date.getUTCHours().toString().length > 1 ? date.getUTCHours() : '0' + date.getUTCHours();
  const minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds();

  return month + '/' + date.getDate() + '/' +  date.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds;
}

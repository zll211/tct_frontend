const formatDate = (date, type = '/') => {
  if (!date) return;
  if (date.toString() === '[Object String]') {
    date = new date();
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(type);
};

const formatDateTime = (date, type = '-') => {
  if (!date) return;
  return formatDate(date, type) + ' ' + formatTime(date);
};

const formatTime = (date) => {
  if (!date) return;
  if (date.toString() === '[Object String]') {
    date = new date(date);
  }
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const strSplice = (str, index, count, newstr = '') => {
  if (!str) return '';
  if (index >= 0) {
    return str.slice(0, index) + newstr + str.slice(index + count);
  } else {
    return str.slice(0, str.length + index) + newstr + str.slice(str.length + index + count);
  }
};


export {
  formatDateTime,
  formatDate,
  formatTime,
  formatNumber,
  strSplice,
};

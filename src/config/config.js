const baseRoutes = ['/404', '/login', '/error'];
const url = window.location.origin;
const baseUrl = `${url}/api`;
const mainTitle = '宫颈液基细胞学辅助诊断平台';

const protocol = window.location.protocol;
let stomp = {
  protocol: 'ws',
  host: '192.168.1.91',
  port: '15674',
  login: 'hzzt',
  passcode: 'hzztrbq@2018',
};
const env = process.env.NODE_ENV;
if (env === 'production' || env === 'none') {
  if (protocol === 'http:') {
    stomp.host = window.location.hostname;
  } else if (protocol === 'https:') {
    stomp.protocol = 'wss';
    stomp.port = '15675';
    stomp.host = window.location.hostname;
  }
}

export {baseRoutes, url, baseUrl};

export default {
  mainTitle,
  stomp,
}



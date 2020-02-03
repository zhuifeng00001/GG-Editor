import { oGetVars } from './urlUnescapeForOes';

const URL = 'api/commonProcessor/commonMethod';
const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  user_id: '1'
};

class NetUitl {
  /*
   *  get请求
   *  url:请求地址
   *  data:参数
   *  successFun:成功-回调函数
   *  failedFun:失败-回调函数
   * */
  static async asyncget(url, params, successFun, failedFun) {
    const _url = _getProcessdUrl(url, params);
    try {
            // fetch请求
      const res = await fetch(_url, {
        method: 'GET',
        headers: { ...defaultHeaders, token: localStorage.getItem('iframeToken') || localStorage.getItem('token') },
        credentials: 'include',
        mode: 'cors',
      });
      if (res.ok) {
        if (successFun) {
          res.json().then((data) => {
            _sessionIsOver(data, successFun);
          });
        } else {
          return res.json();
        }
      } else if (failedFun) {
        res.json().then((data) => {
          failedFun(data);
        });
      } else {
        return res.json();
      }
    } catch (err) {
      console.log(err);
    }
  }
  static get(url, params, successFun, failedFun, authorityUrl) {
    let _url = _getProcessdUrl(url, params, authorityUrl);
    // －－－IE浏览器get请求不刷新数据，要加一个时间强制刷新－－－－－
    const timeRandom = new Date().getTime();
    const addOESToken = oGetVars.token ? `time=${timeRandom}&token=${oGetVars.token}` : `time=${timeRandom}`;
    _url = _url.indexOf('?') > 0 ? `${_url}&${addOESToken}` : `${_url}?${addOESToken}`;
    console.log(oGetVars.token, 'token');
    if (oGetVars.token) {
      localStorage.setItem('token', oGetVars.token);
    }

    // fetch请求
    fetch(_url, {
      method: 'GET',
      headers: { ...defaultHeaders, token: localStorage.getItem('token') },
      credentials: 'include',
      mode: 'cors',
    })
      .then((res) => {
        if (res.ok) {
          if (successFun) {
            res.json().then((data) => {
              _sessionIsOver(data, successFun);
            });
          } else {
            return res.json();
          }
        } else if (failedFun) {
          res.json().then((data) => {
            failedFun(data);
          });
        } else {
          return res.json();
        }

        // return res.json();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /*
   *  post请求
   *  url:请求地址
   *  data:参数
   *  successFun:成功-回调函数
   *  failedFun:失败-回调函数
   * */
  static post(url, params, successFun, failedFun, headerInfo, authorityUrl) {
    if (!url || url.length === 0) {
      url = URL;
    }
    url = _spliceUrl(url, authorityUrl);
    if (oGetVars.token) {
      const addOESToken = `token=${oGetVars.token}`;
      url = url.indexOf('?') > 0 ? `${url}&${addOESToken}` : `${url}?${addOESToken}`;
    }
    if (oGetVars.token) {
      localStorage.setItem('token', oGetVars.token);
    }

    console.log(oGetVars.token, 'token');
    let headers;
    let postBody;
    if (headerInfo) {
      headers = headerInfo;
      postBody = params;
    } else {
      headers = { ...defaultHeaders };
      postBody = JSON.stringify(params);
    }
    headers.token = localStorage.getItem('iframeToken') || localStorage.getItem('token');
    // fetch请求
    fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      mode: 'cors',
      body: postBody,
    })
      .then((res) => {
        if (res.ok) {
          if (successFun) {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.toLowerCase() === 'application/octet-stream') {
              const contentDisposition = res.headers.get('content-Disposition');
              let fileName = contentDisposition && contentDisposition.slice(contentDisposition.toLowerCase().indexOf('filename=') + 9);
              if (fileName[0] === '"') {
                fileName = fileName.slice(1, fileName.length - 2);
              }
              res.blob().then((blob) => {
                successFun({ blob, fileName: decodeURI(fileName) });
              });
            } else {
              res.json().then((data) => {
                _sessionIsOver(data, successFun);
              });
            }
          } else {
            return res.json();
          }
        } else if (failedFun) {
          res.json().then((data) => {
            failedFun(data);
          });
        } else {
          return res.json();
        }
        // return res.json();
      })
      .catch((err) => {
        console.error(err);
      });
  }

}
const _spliceUrl = (url, authorityUrl = false) => {
  let path = url;
  if (url.startsWith('/')) {
    path = url.slice(1, url.length);
  }

  if (window.REACT_APP_CONFIG && window.REACT_APP_CONFIG.bi) {
    return `${window.REACT_APP_CONFIG.bi}${path}`;
  }
  if (authorityUrl) {
    return path;
  }
  if (path.indexOf('bi') === 0 || path.indexOf('bi') === 1 || path.indexOf('sso') === 0 || path.indexOf('sso') === 1 || path.indexOf('portal') === 0 || path.indexOf('portal') === 1 || path.indexOf('oes') === 0 || path.indexOf('oes') === 1) {
    return path;
  }
  // path = `/bi/${path}`;
  return path;
};


const _getProcessdUrl = (url, params, authorityUrl) => {
  if (!url || url.length === 0) {
    url = URL;
  }

  url = _spliceUrl(url, authorityUrl);
  if (params) {
    const paramsArray = [];
        // 拼接参数
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${encodeURIComponent(params[key])}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return url;
};
// －－－session过期－－－－
const _sessionIsOver = (data, successFun) => {
  if (data.code === 401) {
    _goToLogin();
  } else {
    successFun(data);
  }
};
// －－－token不存在－－－－
const _tokenOver = () => {
  if (!localStorage.getItem('token')) {
    _goToLogin();
  } else {
    console.log('token存在:', localStorage.getItem('token'));
  }
};
const _goToLogin = () => {
  window.location = `${location.protocol}//${location.host}/#/user/login`;
};
export default NetUitl;

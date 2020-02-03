const oGetVars = new (function (sSearch) {
  sSearch = unescape(sSearch);// 强制执行解码
  console.log(sSearch, 'sSearch');
  const rNull = /^\s*$/;
  const rBool = /^(true|false)$/i;
  function buildValue(sValue) {
    if (rNull.test(sValue)) { return null; }
    if (rBool.test(sValue)) { return sValue.toLowerCase() === 'true'; }
    if (isFinite(sValue)) { return parseFloat(sValue); }
    if (isFinite(Date.parse(sValue))) {
      return new Date(sValue);
    }
    return sValue;
  }
  if (sSearch.length > 1) {
    let aItKey;
    const aCouples = sSearch.substr(1).split('&');
    for (let nKeyId = 0; nKeyId < aCouples.length; nKeyId++) {
      const temp = aCouples[nKeyId];
      const key = temp.indexOf('=');
      aItKey = [temp.substring(0, key), temp.substring(key + 1)];
      this[unescape(aItKey[0])] = aItKey.length > 1 ? buildValue(unescape(aItKey[1])) : null;
    }
  }
})(window.location.href.substring(location.href.indexOf('?')));

if (oGetVars.token) {
  oGetVars.token = encodeURIComponent(oGetVars.token);
}


export { oGetVars };

export class BrowserUtils {
  static updateBrowserUrl(url) {
    window.history.pushState({}, '', url)
  }

  static addParamsToUrl(url, params) {
    const srcParams = BrowserUtils.getParamsFromUrl(url)
    const newParams = {...srcParams, ...params}
    const noParams = Object.keys(newParams).length === 0
    if (!noParams) {
      if (url.includes('?')) {
        url = url.substring(0, url.indexOf('?')) + `?${BrowserUtils.objToUrlParamString(newParams)}`
      } else {
        url = `${url}?${BrowserUtils.objToUrlParamString(newParams)}`
      }
    }
    return url
  }

  static addBrowserParamsToUrl(url) {
    return BrowserUtils.addParamsToUrl(url, BrowserUtils.urlParamStringToObj(location.search))
  }

  static getParamsFromUrl(url) {
    const qIndex = url.indexOf('?')
    if (qIndex === -1) {
      return {}
    }

    return BrowserUtils.urlParamStringToObj(url.substring(qIndex + 1))
  }

  static urlParamStringToObj(urlParamString) {
    return Object.fromEntries(new URLSearchParams(urlParamString))
  }

  static objToUrlParamString(obj) {
    return Object.keys(obj).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    }).join('&')
  }
}
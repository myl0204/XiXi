const util = {
   // 存储localStorage
  setLocalStorage(id, key, value) {
    let xixi = window.localStorage.getItem('__xixi__')
    if (!xixi) {
      xixi = {}
      xixi[id] = {}
    } else {
      xixi = JSON.parse(xixi)
      if (!xixi[id]) {
        xixi[id] = {}
      }
    }
    xixi[id][key] = value
    xixi = JSON.stringify(xixi)
    window.localStorage.setItem('__xixi__', xixi)
  },
  // 读取localStorage
  getLocalStorage(id, key, def) {
    let xixi = window.localStorage.getItem('__xixi__')
    if (!xixi) {
      return def
    }
    xixi = JSON.parse(xixi)
    if (!xixi[id]) {
      return def
    }
    return xixi[id][key] || def
  },
  // 判断指定id是否曾经登录过
  hadLogged(id, def) {
    let xixi = window.localStorage.getItem('__xixi__')
    if (!xixi) {
      return def
    }
    xixi = JSON.parse(xixi)
    if (xixi[id]) {
      return true
    } else {
      return false
    }
  },
  // 读取cookie
  getCookie() {
    let cookie = {}
    const all = document.cookie
    if (all === '') {
      return cookie
    }
    let cookieList = all.split('; ')
    cookieList.forEach((item) => {
      let d = item.indexOf('=')
      let key = item.substring(0, d)
      key = decodeURIComponent(key)
      let value = item.substring(d + 1)
      value = decodeURIComponent(value)
      cookie[key] = value
    })
    return cookie
  },
  // 设置cookie
  setCookie(name, value, maxAge, path, domain, secure) {
    let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)
    if (maxAge) {
      cookie += '; max-age=' + maxAge
    }
    if (path) {
      cookie += '; path=' + path
    }
    if (domain) {
      cookie += '; domain=' + domain
    }
    if (secure) {
      cookie += '; secure=' + secure
    }
    document.cookie = cookie
  },
  delCookie(name) {
    document.cookie = `${name}=; path=/XiXi; max-age=0`
  }
}

export default util

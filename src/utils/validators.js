const validators = {
  email: (item) => {
    if (!item) return '此欄位不可為空'
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(item).toLowerCase())) {
      return 'E-mail格式錯誤'
    } else {
      return ''
    }
  },
  nickname: (item) => {
    if (!item) return '此欄位不可為空'
    if (item.length < 2) {
      return '暱稱不能少於2個字'
    } else {
      return ''
    }
  },
  password: (item) => {
    if (!item) return '此欄位不可為空'
    if (item.length < 6) {
      return '暱稱不能少於6個字'
    } else {
      return ''
    }
  },
  password2: (item, pass) => {
    if (!item) return '此欄位不可為空'
    if (item !== pass) {
      return '密碼不一致'
    } else {
      return ''
    }
  },
}

export default validators

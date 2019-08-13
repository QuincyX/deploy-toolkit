const axios = require('axios')

const webhook = option => {
  if (option.enable) {
    console.log('------开始执行webhook-------\n')
    return axios.post(option.url, option.content)
  } else {
    return Promise.resolve()
  }
}

module.exports = webhook

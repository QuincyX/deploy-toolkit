const axios = require('axios')

const webhook = option => {
  if (option.enable) {
    return axios.post(option.url, option.content)
  } else {
    return Promise.resolve()
  }
}

module.exports = webhook

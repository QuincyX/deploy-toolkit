const axios = require('axios')

const webhook = option => {
  let body = option.content || {
    msgtype: 'text',
    text: {
      content: option.text
    }
  }
  return axios.post(option.url, body)
}

module.exports = webhook

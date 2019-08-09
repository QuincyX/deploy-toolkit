const axios = require('axios')

const webhook = option => {
  console.log('------开始执行webhook-------\n')
  return axios.post(option.url, option.content)
}

module.exports = webhook

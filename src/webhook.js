const requestHandle = require('request')

const webhook = option => {
  let body = option.content || {
    msgtype: 'text',
    text: {
      content: option.text
    }
  }
  requestHandle(
    {
      url: option.url,
      method: 'post',
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body
    },
    function(err, res) {
      if (!err && res.statusCode == 200) {
        response.setHeader('content-type', 'application/json')
        response.setStatusCode(200)
        response.send('ok')
      }
    }
  )
}

module.exports = webhook

const requestHandle = require('request')

const webhook = option => {
  requestHandle(
    {
      url: option.url,
      method: 'post',
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: {
        msgtype: 'text',
        text: {
          content: option.text
        }
      }
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

export default webhook

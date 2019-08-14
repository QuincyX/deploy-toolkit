const axios = require('axios')

module.exports = (userData, project, option) => {
  if (userData.msg && option.enable && option.key) {
    console.log('------开始执行webhook-------\n')
    let url
    if (option.type === 'work_wx') {
      url = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=' + option.key
    }
    const content = {
      msgtype: 'markdown',
      markdown: {
        content: `<font color="info">${project.name} ${
          project.version
        } 项目更新/部署完成！</font>
  本次更新内容：
  > ${userData.msg}

  [点击预览](${project.url})`
      }
    }
    return axios.post(url, content)
  } else {
    return Promise.resolve()
  }
}

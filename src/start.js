const inquirer = require('inquirer')
const deploy = require('./deploy')
const webhook = require('./webhook')
const autoGit = require('./git')

function getUserMsg() {
  return inquirer
    .prompt([{ name: 'msg', message: '本次更新内容：', type: 'input' }])
    .then(answer => {
      return answer
    })
}

module.exports = option => {
  let userData = {
    msg: ''
  }
  return getUserMsg()
    .then(answer => {
      userData = answer
      return deploy(option.server)
    })
    .then(() => {
      return autoGit(userData, option.git)
    })
    .then(() => {
      return webhook(userData, option.project, option.webhook)
    })
    .then(() => {
      console.log('deploy ok!')
    })
    .catch(err => {
      console.log(err)
    })
}

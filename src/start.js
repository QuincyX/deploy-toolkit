const inquirer = require('inquirer')
const deploy = require('./deploy')
const webhook = require('./webhook')
const autoGit = require('./git')
const print = require('./util/console')

function getUserMsg() {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      resolve({})
    }, 30000)
    inquirer
      .prompt([
        {
          name: 'msg',
          message: '本次更新内容：',
          type: 'input',
          transformer: val => {
            if (val) {
              clearTimeout(timeout)
            }
            return val
          }
        }
      ])
      .then(answer => {
        clearTimeout(timeout)
        resolve(answer)
      })
  })
}

module.exports = option => {
  let userData = {
    msg: ''
  }
  console.log('\n')
  return getUserMsg()
    .then(answer => {
      console.log('\n')
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
      print.success('项目部署成功!\n')
      process.exit()
    })
    .catch(err => {
      print.error(err)
    })
}

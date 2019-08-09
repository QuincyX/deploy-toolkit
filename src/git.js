const inquirer = require('inquirer')
const process = require('child_process')

const autoCommit = option => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: 'commit',
          message: 'commit message：',
          type: 'input',
          default: `commit at ${new Date()}`
        }
      ])
      .then(answer => {
        console.log('------自动执行git commit-------\n')
        process.exec(
          `git  add . && git commit -am "${answer.commit}"`,
          function(error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error)
              reject(error)
            } else {
              console.log(stdout)
              console.log(stderr)
              resolve()
            }
          }
        )
      })
  })
}

module.exports = { autoCommit }

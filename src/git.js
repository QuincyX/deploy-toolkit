const process = require('child_process')
const print = require('./util/console')

function exec(val) {
  return new Promise((resolve, reject) => {
    process.exec(val, (error, stdout, stderr) => {
      if (error) {
        print.error('git exec error:')
        print.error(error)
        reject(error)
      } else {
        print.info(stdout)
        resolve(stdout)
      }
    })
  })
}
module.exports = (userData, option) => {
  if (userData.msg && option.enable) {
    return new Promise(async (resolve, reject) => {
      print.success('开始执行git commit\n')
      const statusMsg = await exec('git status')
      if (!statusMsg.includes('working tree clean')) {
        await exec(`git add . && git commit -am "${userData.msg}"`)
        if (option.version) {
          await exec('npm version ' + option.version)
        }
      }
      resolve()
    })
  } else {
    return Promise.resolve()
  }
}

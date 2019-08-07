const Client = require('ssh2-sftp-client')
const fs = require('fs')
const sftp = new Client()

const staticFilesPath = {
  folder: {
    local: '',
    remote: ''
  }
}
/**
 * 处理文件路径，循环所有文件，如果是图片需要读取成Buffer类型
 **/
let localFileJson = []
function handleFilePath(obj, type) {
  const { local, remote } = obj
  const files = fs.readdirSync(local)
  files.forEach(file => {
    const _lp = `${local}/${file}`
    type = fs.statSync(_lp).isFile()
      ? 'file'
      : fs.statSync(_lp).isDirectory()
      ? 'folder'
      : ''
    let item = {
      type: type,
      file: file,
      // localPath: type !== "img" ? _lp : fs.readFileSync(_lp),
      localPath: _lp,
      remotePath: `${remote}/${file}`
    }
    localFileJson.push(item)
    if (type == 'folder') {
      handleFilePath(
        {
          local: item.localPath,
          remote: `${remote}/${file}`
        },
        'folder'
      )
    }
  })
}
/**
 * 上传文件
 **/
function uploadFile() {
  Object.keys(staticFilesPath).forEach(key => {
    handleFilePath(staticFilesPath[key], key)
  })
  const tasks = localFileJson.map(item => {
    return new Promise((resolve, reject) => {
      if (item.type == 'folder') {
        sftp
          .mkdir(item.remotePath, false)
          .then(res => {
            console.log(`${item.localPath}目录创建成功`)
            resolve()
          })
          .catch(err => {
            console.log(`${item.localPath}目录创建失败`)
            resolve()
          })
      } else {
        sftp
          .put(item.localPath, item.remotePath)
          .then(() => {
            console.log(`${item.localPath}上传完成`)
            resolve()
          })
          .catch(err => {
            console.log(`${item.localPath}上传失败`)
            reject()
          })
      }
    })
  })
  console.log('开始上传...')
  return Promise.all(tasks)
}
const deploy = function(options) {
  return new Promise((resolve, reject) => {
    staticFilesPath.folder = {
      local: options.localPath,
      remote: options.remotePath
    }
    sftp
      .connect(options.server)
      .then(async data => {
        console.log('ssh服务器连接成功！')
        if (options.backupRemotePath) {
          console.log(`备份原目录并创建新目录`)
          const bak_name = `${options.remotePath}-${new Date().getTime()}`
          await sftp.rename(options.remotePath, bak_name)
          await sftp.mkdir(options.remotePath, false)
        }
        console.log('正在上传...')
        return uploadFile()
      })
      .then(res => {
        console.log('------所有文件上传完成!-------\n')
        sftp.end()
        resolve()
      })
      .catch(err => {
        console.error('------上传失败,请检查!-------\n')
        sftp.end()
        reject(err)
      })
  })
}

module.exports = deploy

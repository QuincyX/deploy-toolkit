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
function uploadFile(option) {
  Object.keys(staticFilesPath).forEach(key => {
    handleFilePath(staticFilesPath[key], key)
  })
  const tasks = localFileJson.map(item => {
    return new Promise(async (resolve, reject) => {
      if (item.type == 'folder') {
        if (option.deleteSubDir) {
          await sftp.rmdir(item.remotePath, true).then(() => {
            console.log(`${item.remotePath}目录删除成功`)
          })
        }
        sftp
          .mkdir(item.remotePath, false)
          .then(res => {
            console.log(`${item.remotePath}目录创建成功`)
            resolve()
          })
          .catch(err => {
            console.log(`${item.remotePath}目录创建失败`)
            console.log(err)
            resolve()
          })
      } else {
        sftp
          .fastPut(item.localPath, item.remotePath)
          .then(() => {
            console.log(`${item.remotePath}上传完成`)
            resolve()
          })
          .catch(err => {
            console.log(`${item.remotePath}上传失败`)
            console.log(err)
            reject()
          })
      }
    })
  })
  return Promise.all(tasks)
}

function getConnectConfig(option) {
  return {
    host: option.host,
    port: option.port,
    user: option.user,
    password: option.password
  }
}

async function backRemoteDir(option) {
  console.log(`备份原目录并创建新目录`)
  const bak_name = `${
    staticFilesPath.folder.remotePath
  }-${new Date().getTime()}`
  await sftp.rename(staticFilesPath.folder.remotePath, bak_name)
  await sftp.mkdir(staticFilesPath.folder.remotePath, false)
}

module.exports = option => {
  return new Promise((resolve, reject) => {
    staticFilesPath.folder = {
      local: option.localPath,
      remote: option.remotePath
    }
    if (option.host && option.user && option.remotePath && option.localPath) {
      sftp
        .connect(getConnectConfig(option))
        .then(async data => {
          console.log('ssh服务器连接成功！')
          if (option.backupRemotePath) {
            backRemoteDir()
          } else if (option.deleteRemotePath) {
            await sftp.rmdir(option.remotePath, true)
          }
          console.log('开始上传...')
          return uploadFile(option)
        })
        .then(res => {
          console.log('------所有文件上传完成!-------\n')
          sftp.end()
          resolve()
        })
        .catch(err => {
          console.error('------上传失败,请检查!-------\n')
          console.error(err)
          sftp.end()
          reject(err)
        })
    } else {
      resolve()
    }
  })
}

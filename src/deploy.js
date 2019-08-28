const Client = require('ssh2-sftp-client')
const fs = require('fs')
const sftp = new Client()
const print = require('./util/console')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const ansiEscapes = require('ansi-escapes')
const staticFilesPath = {
  folder: {
    local: '',
    remote: ''
  }
}
let config = {
  localPath: '',
  remotePath: ''
}
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
            printDetail(`${item.remotePath}目录删除成功`)
          })
        }
        sftp
          .mkdir(item.remotePath, false)
          .then(res => {
            printDetail(`${item.remotePath}目录创建成功`)
            resolve()
          })
          .catch(err => {
            printDetail(`${item.remotePath}目录创建失败`)
            printDetail(err)
            resolve()
          })
      } else {
        sftp
          .fastPut(item.localPath, item.remotePath)
          .then(() => {
            printDetail(`${item.remotePath}上传完成`)
            resolve()
          })
          .catch(err => {
            printDetail(`${item.remotePath}上传失败`)
            printDetail(err)
            reject()
          })
      }
    })
  })
  return Promise.all(tasks)
}

function printDetail(val) {
  if (config.isDetailed) {
    print.info(val)
  }
}

function getConnectConfig(option) {
  return {
    host: option.host,
    port: option.port,
    username: option.username,
    password: option.password,
    privateKey: option.privateKey
  }
}

async function backRemoteDir(option) {
  print.info(`备份原目录并创建新目录`)
  const bak_name = `${
    staticFilesPath.folder.remotePath
  }-${new Date().getTime()}`
  await sftp.rename(staticFilesPath.folder.remotePath, bak_name)
  await sftp.mkdir(staticFilesPath.folder.remotePath, false)
}

module.exports = option => {
  config = option
  staticFilesPath.folder = {
    local: option.localPath,
    remote: option.remotePath
  }
  const failed = []
  const successful = []
  if (option.host && option.username && option.remotePath && option.localPath) {
    return ssh
      .connect(getConnectConfig(option))
      .then(() => {
        print.success('ssh服务器连接成功！\n')
        console.log('')
        return ssh.putDirectory(option.localPath, option.remotePath, {
          recursive: true,
          concurrency: 10,
          tick: (localPath, remotePath, error) => {
            if (error) {
              failed.push(localPath)
            } else {
              successful.push(localPath)
              print.progress('正在上传 ' + localPath)
            }
          }
        })
      })
      .then(res => {
        if (!failed.length) {
          console.log('')

          print.success(`所有文件上传完成! 共 ${successful.length} 个文件\n`)
        } else {
          print.error(`共 ${failed.length} 个文件上传失败\n`)
          console.log(failed)
        }
        return res
      })
      .catch(err => {
        print.error('上传失败,请检查!\n')
        print.error(err)
        return err
      })
  } else {
    return
  }
}

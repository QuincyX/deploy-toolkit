# quincy's sftp deploy tool

## Usage

- 引入

```javascript
npm i @quincyx/deploy-toolkit -D
```

- 使用

```javascript
const path = require('path')
const { deploy, webhook } = require('@quincyx/sftp-deploy')
deploy({
  server: {
    host: '39.108.12.96',
    port: '60022',
    user: 'xuqichao',
    password: '123456'
  },
  remotePath: '/opt/web/devmhealtt',
  localPath: path.resolve(__dirname, './dist'),
  backupRemotePath: false
}).then(() => {
    const msg = `update project ok`

    return webhook({
      enable: true,
      url: '',
      content: {
        msgtype: 'markdown',
        markdown: {
          content: `<font color="info">项目更新/部署完成！</font>
本次更新内容：
> ${msg}

[点击预览](https://devm.healtt.com)`
        }
      }
    })
  })
  .then(res => {
    console.log('deploy ok!')
  })
  .catch(err => {
    console.log(err)
  })
```

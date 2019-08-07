# quincy's sftp deploy tool

## Usage

- 引入依赖

```javascript
npm i @quincyx/deploy-toolkit -D
```

- 创建脚本

在项目根目录下创建文件 `deploy.js`

```javascript
const path = require('path')
const { deploy, webhook } = require('@quincyx/sftp-deploy')
deploy({
  server: {
    host: '0.0.0.0',
    port: '22',
    user: '',
    password: ''
  },
  remotePath: '/www/web/',
  localPath: path.resolve(__dirname, './dist'),
  backupRemotePath: false
})
  .then(() => {
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

[点击预览](https://www.baidu.com)`
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

- 添加到 npm script

在 package.json 中添加部署脚本

```json
"scripts": {
  "build:test": "vue-cli-service build --mode test",
  "deploy:test": "vue-cli-service build --mode test && node deploy.js"
}
```

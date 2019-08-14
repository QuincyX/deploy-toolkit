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
const deployTool = require('@quincyx/deploy-toolkit')

const option = {
  server: {
    host: '0.0.0.0',
    port: '22',
    user: '',
    password: '',
    remotePath: '/www/web',
    localPath: path.resolve(__dirname, './dist'),
    backupRemotePath: false,
    deleteSubDir: false
  },
  project: {
    name: config.name,
    version: config.version,
    url: 'https://www.null.com'
  },
  git: {
    enable: true,
    version: 'patch'
  },
  webhook: {
    enable: true,
    type: 'work_wx',
    key: 'work_wx_bot_key'
  }
}

deployTool.start(option)

```

- 添加到 npm script

在 package.json 中添加部署脚本

```json
"scripts": {
  "build:test": "vue-cli-service build --mode test",
  "deploy:test": "vue-cli-service build --mode test && node deploy.js"
}
```

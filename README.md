# quincy's sftp deploy tool

## Usage

- 引入

```javascript
npm i @quincyx/sftp-deploy
```

- 使用

```javascript
const SD = require('@quincyx/sftp-deploy')
const path = require('path')
SD.deploy({
  remote_path: '/data/www/xxx', //服务器项目根路径
  assets_path: path.resolve(__dirname, './dist'), //编译后资源文件夹名称(需上传的文件夹)
  host: 'xxx.xxx.xxx.xxx', //ftp服务器ip
  port: '22', //端口,可不填(默认22)
  user: 'username', //ftp用户名
  password: 'password' //ftp密码
})
```

const inquirer = require('inquirer')

inquirer
  .prompt([{ name: 'desc', message: '本次更新内容：', type: 'input' }])
  .then(answer => {
    console.log('answer:')
    console.log(answer)
  })

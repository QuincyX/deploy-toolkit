const inquirer = require('inquirer')
const process = require('child_process')

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
    console.log('answer:')
    console.log(answer)
    process.exec(`git  add . && git commit -am "${answer.commit}"`, function(
      error,
      stdout,
      stderr
    ) {
      if (error !== null) {
        console.log('exec error: ' + error)
      } else {
        console.log(stdout)
        console.log(stderr)
      }
    })
  })

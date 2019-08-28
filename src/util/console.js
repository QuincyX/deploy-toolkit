const chalk = require('chalk')
const ansiEscapes = require('ansi-escapes')

const error = val => console.log(chalk.bgRed.black(' ERROR '), chalk.red(val))
const warning = val =>
  console.log(chalk.bgYellow.black(' WARN '), chalk.yellow(val))
const success = val =>
  console.log(chalk.bgGreen.black(' DONE '), chalk.green(val))
const info = val => console.log(chalk.bgBlue.black(' INFO '), chalk.blue(val))
const progress = val => {
  process.stdout.write(ansiEscapes.eraseLines(2))
  console.log(chalk.bgCyan.black(' WAIT '), chalk.cyan(val))
}

module.exports = {
  error,
  warning,
  success,
  info,
  progress
}

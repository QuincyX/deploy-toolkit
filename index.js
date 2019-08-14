const start = require('./src/start')
const deploy = require('./src/deploy')
const webhook = require('./src/webhook')
const { autoCommit } = require('./src/git')

module.exports = {
  start,
  deploy,
  webhook,
  autoCommit
}

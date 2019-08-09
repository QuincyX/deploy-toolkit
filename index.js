const deploy = require('./src/deploy')
const webhook = require('./src/webhook')
const { autoCommit } = require('./src/git')

module.exports = {
  deploy,
  webhook,
  autoCommit
}

const print = require('./src/util/console')
const ansiEscapes = require('ansi-escapes')

print.success('progress start')
print.info('')

let count = 10
let loop = setInterval(() => {
  if (count > 0) {
    print.progress('ok' + count)
    count--
  } else {
    clearInterval(loop)
    print.success('progress finish')
  }
}, 500)

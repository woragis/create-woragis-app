const chalk = require('chalk').default

const colors = {
  primary: chalk.cyanBright,
  success: chalk.greenBright,
  warning: chalk.yellowBright,
  error: chalk.redBright,
  info: chalk.blueBright,
  highlight: chalk.bold.white,
  selected: chalk.magentaBright,
}

module.exports = colors

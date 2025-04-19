const inquirer = require('@inquirer/prompts')
const { default: chalk } = require('chalk')
const { default: ora } = require('ora')

async function main() {
  const { input, select, confirm } = inquirer
  const projectName = await input({ message: 'Project Name:' })
  const option = await select({
    message: 'Select a template',
    choices: [
      {
        name: 'React',
        value: 'react-tanstack',
        description: 'Default React Template',
      },
      {
        name: 'Next',
        value: 'next-tanstack',
        description: 'Default Next Template',
      },
      {
        name: 'React Redux',
        value: 'react-redux',
        description: 'React Redux Template',
      },
      {
        name: 'Next Redux',
        value: 'next-redux',
        description: 'Next Redux Template',
      },
      {
        name: 'Svelte',
        value: 'svelte',
        description: 'Default Svelte Template',
      },
      {
        name: 'Thales',
        value: 'thales',
        description: 'Default Thales MVVM Template',
      },
      {
        name: 'LizardTi Aceite',
        value: 'lizardti-aceite',
        description: 'Default LizardTi Aceite System Template',
      },
    ],
  })
  console.log('selected: ', option)
  const userChoice = option
  const confirms = await confirm({
    message: 'Do you want the: ' + userChoice + ' template?',
  })
  if (!confirms) {
    console.log('Exiting...')
    return
  } else {
    console.log(
      chalk.green(
        'Creating ' + projectName + ' with ' + userChoice + ' template...'
      )
    )
    const spinner = ora('Loading....').start()
    setTimeout(() => {
      spinner.succeed(chalk.green('Done!'))
    }, 3000)
  }
}

main()

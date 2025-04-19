#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const { input, select, confirm } = require('@inquirer/prompts')
const chalk = require('chalk').default
const ora = require('ora').default

const aliasMap = {
  react: 'react-tanstack',
  next: 'next-tanstack',
  'react-redux': 'react-redux',
  'next-redux': 'next-redux',
  svelte: 'svelte',
  thales: 'thales',
  'lizardti-aceite': 'lizardti-aceite',
}

const templateExtrasMap = {
  'react-tanstack': 'react',
  'next-tanstack': 'next',
  'react-redux': 'react',
  'next-redux': 'next',
  svelte: 'svelte',
  thales: 'react',
  'lizardti-aceite': 'react',
}

async function run() {
  const args = minimist(process.argv.slice(2), {
    boolean: ['with-ci', 'with-infra'],
  })

  // Get project name
  const targetDir = args._[0] || (await input({ message: 'Project Name:' }))
  const targetPath = path.resolve(process.cwd(), targetDir)

  // Select template if not passed via --template
  let template = args.template
  if (!template) {
    template = await select({
      message: 'Select a template:',
      choices: Object.entries(aliasMap).map(([k, v]) => ({
        name: k.charAt(0).toUpperCase() + k.slice(1),
        value: v,
        description: `Template for ${k}`,
      })),
    })
  }

  template = aliasMap[template] || template
  const extrasKey = templateExtrasMap[template]

  const templateBasePath = path.join(__dirname, '..', 'templates', template)
  const extrasBasePath = extrasKey
    ? path.join(__dirname, '..', 'extras', extrasKey)
    : null

  if (!fs.existsSync(templateBasePath)) {
    console.error(chalk.red(`❌ Template "${template}" not found.`))
    process.exit(1)
  }

  const confirmUse = await confirm({
    message: `Create "${chalk.cyan(targetDir)}" using template "${chalk.green(
      template
    )}"?`,
  })

  if (!confirmUse) {
    console.log(chalk.yellow('Operation cancelled.'))
    return
  }

  const spinner = ora('Creating project...').start()

  try {
    fs.mkdirSync(targetPath, { recursive: true })
    fs.cpSync(templateBasePath, targetPath, { recursive: true })

    if (
      (args['with-ci'] ||
        (await confirm({ message: 'Include CI configuration?' }))) &&
      extrasBasePath
    ) {
      const ciPath = path.join(extrasBasePath, '.github')
      if (fs.existsSync(ciPath)) {
        fs.cpSync(ciPath, path.join(targetPath, '.github'), { recursive: true })
      } else {
        console.warn(chalk.yellow(`⚠️  No CI found for extras "${extrasKey}"`))
      }
    }

    if (
      (args['with-infra'] ||
        (await confirm({ message: 'Include Terraform infrastructure?' }))) &&
      extrasBasePath
    ) {
      const infraPath = path.join(extrasBasePath, 'terraform')
      if (fs.existsSync(infraPath)) {
        fs.cpSync(infraPath, path.join(targetPath, 'terraform'), {
          recursive: true,
        })
      } else {
        console.warn(
          chalk.yellow(`⚠️  No Terraform found for extras "${extrasKey}"`)
        )
      }
    }

    spinner.succeed(
      `✔ Created "${chalk.green(template)}" project at ${chalk.cyan(
        targetPath
      )}`
    )
  } catch (err) {
    spinner.fail(chalk.red('Something went wrong: ' + err.message))
    process.exit(1)
  }
}

run()

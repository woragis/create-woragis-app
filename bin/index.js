#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { input, select, confirm, checkbox } = require('@inquirer/prompts')
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
  const projectName = await input({ message: 'Project name:' })
  const projectPath = path.resolve(process.cwd(), projectName)

  const selectedTemplate = await select({
    message: 'Select a template:',
    choices: Object.entries(aliasMap).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      description: `Template for ${key}`,
    })),
  })

  const extrasKey = templateExtrasMap[selectedTemplate]
  const templatePath = path.join(__dirname, '..', 'templates', selectedTemplate)
  const extrasBasePath = extrasKey
    ? path.join(__dirname, '..', 'extras', extrasKey)
    : null

  if (!fs.existsSync(templatePath)) {
    console.error(chalk.red(`❌ Template "${selectedTemplate}" not found.`))
    process.exit(1)
  }

  const confirmed = await confirm({
    message: `Create "${chalk.cyan(projectName)}" with "${chalk.green(
      selectedTemplate
    )}"?`,
  })
  if (!confirmed) {
    console.log(chalk.yellow('Operation cancelled.'))
    return
  }

  const extras = await checkbox({
    message: 'Select additional features to include:',
    choices: [
      { name: 'CI (GitHub Actions)', value: 'ci' },
      { name: 'Terraform Infrastructure', value: 'infra' },
    ],
  })

  const includeCI = extras.includes('ci')
  const includeInfra = extras.includes('infra')

  const spinner = ora('Creating project...').start()

  try {
    fs.mkdirSync(projectPath, { recursive: true })
    fs.cpSync(templatePath, projectPath, { recursive: true })

    if (includeCI && extrasBasePath) {
      const ciPath = path.join(extrasBasePath, '.github')
      if (fs.existsSync(ciPath)) {
        fs.cpSync(ciPath, path.join(projectPath, '.github'), {
          recursive: true,
        })
      } else {
        console.warn(
          chalk.yellow(`⚠️ No CI folder found for extras "${extrasKey}"`)
        )
      }
    }

    if (includeInfra && extrasBasePath) {
      const infraPath = path.join(extrasBasePath, 'terraform')
      if (fs.existsSync(infraPath)) {
        fs.cpSync(infraPath, path.join(projectPath, 'terraform'), {
          recursive: true,
        })
      } else {
        console.warn(
          chalk.yellow(`⚠️ No Terraform folder found for extras "${extrasKey}"`)
        )
      }
    }

    spinner.succeed(`✔ Project created at ${chalk.green(projectPath)}`)
  } catch (err) {
    spinner.fail(chalk.red('Error: ' + err.message))
    process.exit(1)
  }
}

run()

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
  const extrasBasePath = path.join(__dirname, '..', 'extras', extrasKey)

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

    // Only copy Terraform if infra is selected
    if (includeInfra && extrasBasePath) {
      const terraformPath = path.join(extrasBasePath, 'infra', 'terraform')

      if (fs.existsSync(terraformPath)) {
        fs.cpSync(terraformPath, path.join(projectPath, 'terraform'), {
          recursive: true,
        })
      } else {
        console.warn(
          chalk.yellow(
            `⚠️ No Terraform folder found at "${terraformPath}" for extras "${extrasKey}"`
          )
        )
      }

      // Copy terraform.yml if CI is also selected
      if (includeCI) {
        const terraformWorkflowPath = path.join(
          extrasBasePath,
          'infra',
          '.github',
          'workflows',
          'terraform.yml'
        )
        if (fs.existsSync(terraformWorkflowPath)) {
          const workflowsPath = path.join(projectPath, '.github', 'workflows')
          fs.mkdirSync(workflowsPath, { recursive: true })
          fs.cpSync(
            terraformWorkflowPath,
            path.join(workflowsPath, 'terraform.yml')
          )
        }
      }
    }

    // Only copy CI if ci is selected
    if (includeCI && extrasBasePath) {
      const ciPath = path.join(
        extrasBasePath,
        'ci',
        '.github',
        'workflows',
        'ci.yml'
      )

      if (fs.existsSync(ciPath)) {
        const workflowsPath = path.join(projectPath, '.github', 'workflows')
        fs.mkdirSync(workflowsPath, { recursive: true })
        fs.cpSync(ciPath, path.join(workflowsPath, 'ci.yml'))
      } else {
        console.warn(
          chalk.yellow(
            `⚠️ No CI file found at "${ciPath}" for extras "${extrasKey}"`
          )
        )
      }
    }

    spinner.succeed(`Project created at ${chalk.green(projectPath)}`)
    if (includeCI) console.log(chalk.green('✔ CI files added'))
    if (includeInfra)
      console.log(chalk.green('✔ Terraform infrastructure added'))
  } catch (err) {
    spinner.fail(chalk.red('Error: ' + err.message))
    process.exit(1)
  }
}

run()

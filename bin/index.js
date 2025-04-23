#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { input, select, confirm, checkbox } = require('@inquirer/prompts')
const chalk = require('chalk').default
const ora = require('ora').default

// Define a consistent color palette
const colors = {
  primary: chalk.cyanBright,
  success: chalk.greenBright,
  warning: chalk.yellowBright,
  error: chalk.redBright,
  info: chalk.blueBright,
  highlight: chalk.bold.white,
}

// Custom spinner style
const spinnerStyle = {
  spinner: 'dots',
  color: 'cyan',
}

// Alias and template mappings
const aliasMap = {
  react: 'react-tanstack',
  next: 'next-tanstack',
  'react-redux': 'react-redux',
  'next-redux': 'next-redux',
  svelte: 'svelte',
  thales: 'thales',
  'lizardti-aceite-front': 'lizardti-aceite-front',
  'lizardti-aceite-back': 'lizardti-aceite-back',
}

const templateExtrasMap = {
  'react-tanstack': 'react',
  'next-tanstack': 'next',
  'react-redux': 'react',
  'next-redux': 'next',
  svelte: 'svelte',
  thales: 'react',
  'lizardti-aceite-front': 'react',
  'lizardti-aceite-back': 'lizardti-aceite-back',
}

// Welcome banner
console.log(
  colors.primary(`
  ╔════════════════════════════════════╗
  ║   Welcome to Woragis Creator CLI   ║
  ╚════════════════════════════════════╝
  `)
)

async function run() {
  // Project name prompt
  const projectName = await input({
    message: colors.primary('📋 Enter your project name:'),
    default: 'my-project',
    validate: (input) => {
      if (input.trim() === '') {
        return colors.error("Project name can't be empty!")
      }
      return true
    },
  })
  const projectPath = path.resolve(process.cwd(), projectName)

  // Template selection
  const selectedTemplate = await select({
    message: colors.primary('🛠️ Select a template:'),
    choices: Object.entries(aliasMap).map(([key, value]) => ({
      name: colors.info(key.charAt(0).toUpperCase() + key.slice(1)),
      value,
      description: colors.highlight(`Create a ${key} project`),
    })),
  })

  // Feature selection
  const extras = await checkbox({
    message: colors.primary('🔧 Select additional features:'),
    choices: [
      { name: colors.info('CI (GitHub Actions)'), value: 'ci' },
      { name: colors.info('Terraform Infrastructure'), value: 'infra' },
    ],
  })

  // Confirmation
  const confirmed = await confirm({
    message: colors.primary(
      `🚀 Create "${colors.highlight(projectName)}" with ${colors.info(
        selectedTemplate
      )} template?`
    ),
  })

  if (!confirmed) {
    console.log(colors.warning('⚠️ Operation cancelled.'))
    return
  }

  // Setup paths
  const extrasKey = templateExtrasMap[selectedTemplate]
  const templatePath = path.join(__dirname, '..', 'templates', selectedTemplate)
  const extrasBasePath = path.join(__dirname, '..', 'extras', extrasKey)

  if (!fs.existsSync(templatePath)) {
    console.error(colors.error(`❌ Template "${selectedTemplate}" not found.`))
    process.exit(1)
  }

  // Create project with progress feedback
  const spinner = ora({
    text: colors.primary('Initializing project...'),
    ...spinnerStyle,
  }).start()

  try {
    // Step 1: Create project directory and copy template
    spinner.text = colors.primary('📂 Creating project directory...')
    fs.mkdirSync(projectPath, { recursive: true })
    spinner.text = colors.primary('📦 Copying template files...')
    fs.cpSync(templatePath, projectPath, { recursive: true })

    const includeCI = extras.includes('ci')
    const includeInfra = extras.includes('infra')

    // Step 2: Add Terraform infrastructure
    if (includeInfra && extrasBasePath) {
      const terraformPath = path.join(extrasBasePath, 'infra', 'terraform')
      if (fs.existsSync(terraformPath)) {
        spinner.text = colors.primary('🏗️ Adding Terraform infrastructure...')
        fs.cpSync(terraformPath, path.join(projectPath, 'terraform'), {
          recursive: true,
        })
      } else {
        spinner.warn(
          colors.warning(`⚠️ No Terraform folder found for "${extrasKey}"`)
        )
      }

      // Add Terraform workflow if CI is also selected
      if (includeCI) {
        const terraformWorkflowPath = path.join(
          extrasBasePath,
          'infra',
          '.github',
          'workflows',
          'terraform.yml'
        )
        if (fs.existsSync(terraformWorkflowPath)) {
          spinner.text = colors.primary('🔄 Adding Terraform CI workflow...')
          const workflowsPath = path.join(projectPath, '.github', 'workflows')
          fs.mkdirSync(workflowsPath, { recursive: true })
          fs.cpSync(
            terraformWorkflowPath,
            path.join(workflowsPath, 'terraform.yml')
          )
        }
      }
    }

    // Step 3: Add CI workflow
    if (includeCI && extrasBasePath) {
      const ciPath = path.join(
        extrasBasePath,
        'ci',
        '.github',
        'workflows',
        'ci.yml'
      )
      if (fs.existsSync(ciPath)) {
        spinner.text = colors.primary('🔧 Adding CI workflow...')
        const workflowsPath = path.join(projectPath, '.github', 'workflows')
        fs.mkdirSync(workflowsPath, { recursive: true })
        fs.cpSync(ciPath, path.join(workflowsPath, 'ci.yml'))
      } else {
        spinner.warn(colors.warning(`⚠️ No CI file found for "${extrasKey}"`))
      }
    }

    // Success message
    spinner.succeed(colors.success(`🎉 Project created at ${projectPath}`))

    // Summary of added features
    if (includeCI) console.log(colors.success('✔ Added CI (GitHub Actions)'))
    if (includeInfra)
      console.log(colors.success('✔ Added Terraform infrastructure'))

    // Next steps
    console.log(
      colors.primary(`
  ╔═══════════════════════╗
  ║   Next Steps          ║
  ╚═══════════════════════╝
  ${colors.highlight(`cd ${projectName}`)}
  ${colors.highlight('npm install')}  ${colors.info('# or yarn install')}
  ${colors.highlight('npm run dev')}   ${colors.info('# or yarn dev')}
      `)
    )
  } catch (err) {
    spinner.fail(colors.error(`❌ Error: ${err.message}`))
    process.exit(1)
  }
}

run()

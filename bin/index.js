#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { confirm, checkbox } = require('@inquirer/prompts')
const prompts = require('prompts')
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
  selected: chalk.magentaBright,
}

// Custom spinner style
const spinnerStyle = {
  spinner: 'dots',
  color: 'cyan',
}

// Templates configuration with name, value, and extras
const templates = [
  { name: 'React', value: 'react-tanstack', extras: 'react' },
  { name: 'Next', value: 'next-tanstack', extras: 'next' },
  { name: 'React Redux', value: 'react-redux', extras: 'react' },
  { name: 'Next Redux', value: 'next-redux', extras: 'next' },
  { name: 'Svelte', value: 'svelte', extras: 'svelte' },
  { name: 'Thales', value: 'thales', extras: 'react' },
  {
    name: 'Lizardti Aceite Frontend',
    value: 'lizardti-aceite-front',
    extras: 'react',
  },
  {
    name: 'Lizardti Aceite Backend',
    value: 'lizardti-aceite-back',
    extras: 'lizardti-aceite-back',
  },
]

const baseQuestions = [
  // First question: Project name
  {
    type: 'text',
    name: 'projectName',
    message: colors.primary('📛 Project name:'),
    initial: 'my-project',
    validate: (input) => {
      if (input.trim() === '') {
        return colors.error("Project name can't be empty!")
      }
      return true
    },
  },
  // Second question: Project type
  {
    type: 'select',
    name: 'projectType',
    message: colors.primary('🧱 Template type:'),
    choices: templates.map((template) => ({
      title: colors.info(template.name),
      value: template.value,
    })),
  },
  // Third question: Extras
  // {
  //   type: 'multiselect',
  //   name: 'extras',
  //   message: colors.primary('🔧 Select additional features:'),
  //   choices: [
  //     { name: colors.info('CI (GitHub Actions)'), value: 'ci' },
  //     { name: colors.info('Terraform Infrastructure'), value: 'infra' },
  //   ],
  //   initial: ['ci', 'infra'], // ✅ default selected extras
  //   instructions: false,
  //   format: (choices) => choices.map((choice) => colors.selected(choice)),
  // },
]

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
  const { projectName, projectType } = await prompts(baseQuestions)
  const projectPath = path.resolve(process.cwd(), projectName)

  // Feature selection with custom selected item color
  const extras = await checkbox({
    message: colors.primary('🔧 Select additional features:'),
    choices: [
      { name: colors.info('CI (GitHub Actions)'), value: 'ci' },
      { name: colors.info('Terraform Infrastructure'), value: 'infra' },
    ],
    format: (choices) => choices.map((choice) => colors.selected(choice)),
  })

  // Confirmation
  const confirmed = await confirm({
    message: colors.primary(
      `🚀 Create "${colors.highlight(projectName)}" with ${colors.info(
        projectType
      )} template?`
    ),
  })

  if (!confirmed) {
    console.log(colors.warning('⚠️ Operation cancelled.'))
    return
  }

  // Find the selected template's extras
  const selectedTemplateConfig = templates.find((t) => t.value === projectType)
  const extrasKey = selectedTemplateConfig.extras
  const templatePath = path.join(__dirname, '..', 'templates', projectType)
  const extrasBasePath = path.join(__dirname, '..', 'extras', extrasKey)

  if (!fs.existsSync(templatePath)) {
    console.error(colors.error(`❌ Template "${projectType}" not found.`))
    process.exit(1)
  }

  // Create project with progress feedback
  const spinner = ora({
    text: colors.primary('Initializing project...'),
    ...spinnerStyle,
  }).start()
  const variables = {
    projectName,
    projectType: projectType,
    bucketName: `${projectName}-bucket`,
    awsRegion: 'us-east-1',
    domainName: 'example.com',
    subdomain: 'www',
  }
  try {
    // Step 1: Create project directory and copy template
    spinner.text = colors.primary('📂 Creating project directory...')
    fs.mkdirSync(projectPath, { recursive: true })
    spinner.text = colors.primary('📦 Copying template files...')
    copyTemplate({
      templatePath,
      outputPath: projectPath,
      variables,
    })

    const includeCI = extras.includes('ci')
    const includeInfra = extras.includes('infra')

    // Step 2: Add Terraform infrastructure
    if (includeInfra && extrasBasePath) {
      const terraformPath = path.join(extrasBasePath, 'infra', 'terraform')
      if (fs.existsSync(terraformPath)) {
        spinner.text = colors.primary('🏗️ Adding Terraform infrastructure...')
        copyTemplate({
          terraformPath,
          outputPath: path.join(projectPath, 'terraform'),
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
        copyTemplate({
          ciPath,
          outputPath: path.join(workflowsPath, 'ci.yml'),
          variables,
        })
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

function copyRecursiveSyncWithTemplating(src, dest, variables) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)

    // Replace placeholders in file/folder names (e.g., __projectName__)
    const replacedName = entry.name.replace(
      /__([a-zA-Z0-9_]+)__/g,
      (_, key) => variables[key] || key
    )
    const isTemplateFile = replacedName.endsWith('.tmpl')
    const finalName = isTemplateFile
      ? replacedName.replace(/\.tmpl$/, '')
      : replacedName
    const destPath = path.join(dest, finalName)

    if (entry.isDirectory()) {
      copyRecursiveSyncWithTemplating(srcPath, destPath, variables)
    } else {
      if (isTemplateFile) {
        let content = fs.readFileSync(srcPath, 'utf8')
        content = content.replace(
          /{{\s*(\w+)\s*}}/g,
          (_, key) => variables[key] || ''
        )
        fs.writeFileSync(destPath, content)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
}

function copyRecursiveStatic(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyRecursiveStatic(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyTemplate({ templatePath, outputPath, variables = {} }) {
  const staticPath = path.join(templatePath, 'static')
  const dynamicPath = path.join(templatePath, 'dynamic')

  if (fs.existsSync(staticPath)) {
    copyRecursiveStatic(staticPath, outputPath)
  }

  if (fs.existsSync(dynamicPath)) {
    copyRecursiveSyncWithTemplating(dynamicPath, outputPath, variables)
  }
}

run()

#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { confirm, checkbox } = require('@inquirer/prompts')
const prompts = require('prompts')
const {
  extrasQuestions,
  baseQuestions,
  infraQuestions,
  ciQuestions,
  confirmQuestion,
} = require('./questions')
const colors = require('./colors')
const { copyTemplate } = require('./lib')
const templates = require('./templates')
const ora = require('ora').default

// Custom spinner style
const spinnerStyle = {
  spinner: 'dots',
  color: 'cyan',
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
  const answers = await prompts(baseQuestions)

  const projectPath = path.resolve(process.cwd(), answers.projectName)

  const extras = await checkbox(extrasQuestions)

  if (extras.includes('infra')) {
    const infraAnswers = await prompts(infraQuestions)
    Object.assign(answers, infraAnswers)
  }

  if (extras.includes('ci')) {
    const ciAnswers = await prompts(ciQuestions)
    Object.assign(answers, ciAnswers)
  }

  // Confirmation
  const confirmed = await confirm(
    confirmQuestion(answers.projectName, answers.projectType)
  )

  if (!confirmed) {
    console.log(colors.warning('⚠️ Operation cancelled.'))
    return
  }

  // Find the selected template's extras
  const selectedTemplateConfig = templates.find(
    (t) => t.value === answers.projectType
  )
  const extrasKey = selectedTemplateConfig.extras
  const templatePath = path.join(
    __dirname,
    '..',
    'templates',
    answers.projectType
  )
  const extrasBasePath = path.join(__dirname, '..', 'extras', extrasKey)

  if (!fs.existsSync(templatePath)) {
    console.error(
      colors.error(`❌ Template "${answers.projectType}" not found.`)
    )
    process.exit(1)
  }

  // Create project with progress feedback
  const spinner = ora({
    text: colors.primary('Initializing project...'),
    ...spinnerStyle,
  }).start()
  const variables = {
    projectName: answers.projectName,
    projectType: answers.projectType,
    bucketName: `${answers.projectName}-bucket`,
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
  ${colors.highlight(`cd ${answers.projectName}`)}
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

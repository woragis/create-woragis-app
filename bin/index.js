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
  aceiteFrontendQuestions,
  aceiteBackendQuestions,
} = require('./lib/questions')
const colors = require('./lib/colors')
const { copyTemplate, copyRecursiveDynamic } = require('./lib/copy')
const templates = require('./lib/templates')
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

  let variables = {
    projectName: answers.projectName,
    projectType: answers.projectType,
  }

  if (extras.includes('infra')) {
    const infraAnswers = await prompts(infraQuestions)
    Object.assign(answers, infraAnswers)
    variables.bucketName = answers.bucketName
    variables.awsRegion = answers.awsRegion
    variables.domainName = answers.domainName
    variables.subdomain = answers.subdomain
  }

  if (extras.includes('ci') && !extras.includes('infra')) {
    const ciAnswers = await prompts(ciQuestions)
    Object.assign(answers, ciAnswers)
    variables.bucketName = answers.bucketName
    variables.awsRegion = answers.awsRegion
  }

  // 'lizardti.com' questions
  // Frontend
  if (answers.projectType === 'lizardti-aceite-front') {
    const aceiteFrontendAnswers = await prompts(aceiteFrontendQuestions)
    Object.assign(answers, aceiteFrontendAnswers)
    variables.viteBackendUrl = answers.viteBackendUrl
  }

  // Backend
  if (answers.projectType === 'lizardti-aceite-back') {
    const aceiteBackendAnswers = await prompts(aceiteBackendQuestions)
    Object.assign(answers, aceiteBackendAnswers)
    variables.tableName = answers.tableName
    variables.userPoolId = answers.userPoolId
    variables.clientId = answers.clientId
    variables.clientSecret = answers.clientSecret
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
    if (includeInfra && fs.existsSync(extrasBasePath)) {
      const infraPath = path.join(extrasBasePath, 'infra', 'terraform')

      if (fs.existsSync(infraPath)) {
        spinner.text = colors.primary('🏗️ Adding Terraform infrastructure...')
        copyRecursiveDynamic({
          templatePath: infraPath,
          outputPath: path.join(projectPath, 'terraform'),
          variables,
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
          'workflows'
        )
        if (fs.existsSync(terraformWorkflowPath)) {
          spinner.text = colors.primary('🔄 Adding Terraform CI workflow...')
          const workflowsPath = path.join(projectPath, '.github', 'workflows')
          fs.mkdirSync(workflowsPath, { recursive: true })
          copyRecursiveDynamic({
            templatePath: terraformWorkflowPath,
            outputPath: workflowsPath,
            variables,
          })
        }
      }
    }

    // Step 3: Add CI workflow
    if (includeCI && fs.existsSync(extrasBasePath)) {
      const ciPath = path.join(extrasBasePath, 'ci', '.github', 'workflows')
      if (fs.existsSync(ciPath)) {
        spinner.text = colors.primary('🔧 Adding CI workflow...')
        const workflowsPath = path.join(projectPath, '.github', 'workflows')
        fs.mkdirSync(workflowsPath, { recursive: true })
        copyRecursiveDynamic({
          templatePath: ciPath,
          outputPath: workflowsPath,
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
    spinner.fail(colors.error(`❌ Error: ${err.message} ${err.stack}`))
    process.exit(1)
  }
}

run()

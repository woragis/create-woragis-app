const templates = require('./templates')
const colors = require('./colors')

const baseQuestions = [
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
  {
    type: 'select',
    name: 'projectType',
    message: colors.primary('🧱 Template type:'),
    choices: templates.map((template) => ({
      title: colors.info(template.name),
      value: template.value,
      extras: template.extras,
    })),
  },
]

const extrasQuestions = {
  message: colors.primary('🔧 Select additional features:'),
  choices: [
    { name: colors.info('CI (GitHub Actions)'), value: 'ci' },
    { name: colors.info('Terraform Infrastructure'), value: 'infra' },
  ],
  format: (choices) => choices.map((choice) => colors.selected(choice)),
}

// default questions:
// project name (different than project location, first question)
// template type (select) [react, nextjs, svelte, etc.] [tanstack and redux] [aceite-front e aceite-back]
const infraQuestions = [
  // questions: aws region, bucket name, domain name, subdomain
  {
    type: 'text',
    name: 'awsRegion',
    message: '🌍 AWS region:',
    initial: 'us-east-1',
  },
  {
    type: 'text',
    name: 'bucketName',
    message: '🪣 S3 bucket name:',
    initial: (prev, answers) => `${answers.projectName}-bucket`,
  },
  {
    type: 'text',
    name: 'domainName',
    message: '🌐 Root domain:',
    initial: 'example.com',
  },
  {
    type: 'text',
    name: 'subdomain',
    message: '🔧 Subdomain:',
    initial: 'www',
  },
]

const ciQuestions = [
  // questions: aws region and bucket name
  {
    type: 'confirm',
    name: 'deployTerraform',
    message: '🚀 Deploy Terraform from CI?',
    initial: true,
  },
  {
    type: (prev) => (prev ? 'text' : null),
    name: 'Aws region',
    message: '🔐 CI AWS Role ARN:',
  },
  {
    type: 'confirm',
    name: 'usePreviewEnvs',
    message: '🧪 Use preview environments?',
    initial: false,
  },
]

const confirmQuestion = (projectName, projectType) => ({
  message: colors.primary(
    `🚀 Create "${colors.highlight(projectName)}" with ${colors.info(
      projectType
    )} template?`
  ),
})

module.exports = {
  baseQuestions,
  extrasQuestions,
  infraQuestions,
  ciQuestions,
  confirmQuestion,
}

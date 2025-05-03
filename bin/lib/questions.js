const templates = require('./templates')
const colors = require('./colors')

const baseQuestions = [
  {
    type: 'text',
    name: 'projectName',
    message: colors.primary('📛 What is your project’s name?'),
    initial: 'my-project',
    validate: (input) => {
      if (input.trim() === '') {
        return colors.error("⚠️ Project name can't be empty!")
      }
      return true
    },
  },
  {
    type: 'select',
    name: 'projectType',
    message: colors.primary('🧱 Choose a template:'),
    choices: templates.map((template) => ({
      title: colors.info(template.name),
      value: template.value,
      extras: template.extras,
    })),
  },
]

const extrasQuestions = {
  message: colors.primary('🛠️ What extra features do you want?'),
  choices: [
    { name: colors.info('🔄 CI (GitHub Actions)'), value: 'ci' },
    { name: colors.info('🏗️ Terraform Infrastructure'), value: 'infra' },
  ],
  format: (choices) => choices.map((choice) => colors.selected(choice)),
}

const infraQuestions = [
  {
    type: 'text',
    name: 'awsRegion',
    message: colors.primary('🌍 Which AWS region to deploy to?'),
    initial: 'us-east-1',
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ AWS region is required'),
  },
  {
    type: 'text',
    name: 'bucketName',
    message: colors.primary('🪣 S3 Bucket name for hosting:'),
    initial: (prev, answers) => `${answers.projectName}-bucket`,
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ Bucket name is required'),
  },
  {
    type: 'text',
    name: 'domainName',
    message: colors.primary('🌐 Root domain (e.g., example.com):'),
    initial: 'example.com',
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ Domain name is required'),
  },
  {
    type: 'text',
    name: 'subdomain',
    message: colors.primary('🔧 Subdomain (e.g., www):'),
    initial: 'www',
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ Subdomain is required'),
  },
]

const ciQuestions = [
  {
    type: 'text',
    name: 'awsRegion',
    message: colors.primary('🌍 CI AWS region:'),
    initial: 'us-east-1',
    skip: (prev, answers) => answers.selectedExtras?.includes('infra'),
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ AWS region is required'),
  },
  {
    type: 'text',
    name: 'bucketName',
    message: colors.primary('🪣 CI S3 bucket name:'),
    initial: (prev, answers) => `${answers.projectName}-bucket`,
    skip: (prev, answers) => answers.selectedExtras?.includes('infra'),
    validate: (input) =>
      input.trim() !== '' || colors.error('⚠️ Bucket name is required'),
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

#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
  boolean: ['with-ci', 'with-infra'],
})

const targetDir = args._[0] || '.'
let template = args.template || 'react'

const aliasMap = {
  react: 'react-tanstack',
  next: 'next-tanstack',
  'react-redux': 'react-redux',
  'next-redux': 'next-redux',
  svelte: 'svelte',
}

template = aliasMap[template] || template

const templatePath = path.join(__dirname, '..', 'templates', template)
const targetPath = path.resolve(process.cwd(), targetDir)

if (!fs.existsSync(templatePath)) {
  console.error(`Template "${template}" not found.`)
  process.exit(1)
}

fs.mkdirSync(targetPath, { recursive: true })
fs.cpSync(path.join(templatePath, 'base'), targetPath, { recursive: true })

if (args['with-ci']) {
  fs.cpSync(
    path.join(templatePath, '.github'),
    path.join(targetPath, '.github'),
    { recursive: true }
  )
}

if (args['with-infra']) {
  fs.cpSync(
    path.join(templatePath, 'terraform'),
    path.join(targetPath, 'terraform'),
    { recursive: true }
  )
}

console.log(`✔ Created ${template} project at ${targetPath}`)

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

template = aliasMap[template] || template

const extrasKey = templateExtrasMap[template]
const templateBasePath = path.join(
  __dirname,
  '..',
  'templates',
  template,
  'base'
)
const extrasBasePath = extrasKey
  ? path.join(__dirname, '..', 'extras', extrasKey)
  : null
const targetPath = path.resolve(process.cwd(), targetDir)

if (!fs.existsSync(templateBasePath)) {
  console.error(`❌ Template "${template}" not found.`)
  process.exit(1)
}

fs.mkdirSync(targetPath, { recursive: true })
fs.cpSync(templateBasePath, targetPath, { recursive: true })

if (args['with-ci'] && extrasBasePath) {
  const ciPath = path.join(extrasBasePath, '.github')
  if (fs.existsSync(ciPath)) {
    fs.cpSync(ciPath, path.join(targetPath, '.github'), { recursive: true })
  } else {
    console.warn(`⚠️  No CI found for extras "${extrasKey}"`)
  }
}

if (args['with-infra'] && extrasBasePath) {
  const infraPath = path.join(extrasBasePath, 'terraform')
  if (fs.existsSync(infraPath)) {
    fs.cpSync(infraPath, path.join(targetPath, 'terraform'), {
      recursive: true,
    })
  } else {
    console.warn(`⚠️  No Terraform found for extras "${extrasKey}"`)
  }
}

console.log(`✔ Created "${template}" project at ${targetPath}`)

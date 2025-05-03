const fs = require('fs')
const path = require('path')

function copyRecursiveDynamic(src, dest, variables) {
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
      copyRecursiveDynamic(srcPath, destPath, variables)
    } else {
      if (isTemplateFile) {
        let content = fs.readFileSync(srcPath, 'utf8')
        content = content.replace(
          /__\s*(\w+)\s*__/g,
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
    copyRecursiveDynamic(dynamicPath, outputPath, variables)
  }
}

module.exports = { copyTemplate }

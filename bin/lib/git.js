const { execSync } = require('child_process')
const colors = require('./colors')

function initGitRepo(projectPath) {
  try {
    execSync('git init', { cwd: projectPath, stdio: 'ignore' })
    execSync('git add .', { cwd: projectPath, stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', {
      cwd: projectPath,
      stdio: 'ignore',
    })
    console.log(colors.success('✅ Git repository initialized!'))
  } catch (err) {
    console.error(
      colors.error('❌ Failed to initialize Git repository:'),
      err.message
    )
  }
}

module.exports = { initGitRepo }

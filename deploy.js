import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'

if (existsSync('dist/.git')) {
  rmSync('dist/.git', { recursive: true, force: true })
}

try {
  execSync(`cd dist && git init && git checkout -b gh-pages`, { stdio: 'inherit' })
  execSync(`cd dist && git add . && git commit -m "Deploy"`, { stdio: 'inherit' })
  execSync(`cd dist && git push -f https://github.com/haruxiu/kaj_pokladna.git gh-pages`, { stdio: 'inherit' })
  console.log('✅ Deployed successfully!')
} catch (e) {
  console.error('❌ Deployment failed:', e)
}

import { build } from 'vite'
import config from './vite.config.js'

build(config)
  .then(() => console.log('Build successful!'))
  .catch((e) => {
    console.error('Build failed:', e)
    process.exit(1)
  })

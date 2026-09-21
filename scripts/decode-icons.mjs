import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })
for (const name of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  const b64 = readFileSync(join(root, 'scripts/icons', `${name}.b64`), 'utf8').trim()
  writeFileSync(join(outDir, name), Buffer.from(b64, 'base64'))
  console.log('wrote', name)
}

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { STAGE_NAMES } from '../src/stages.ts'
import { validateCatalog, type ValidatableEntry } from '../src/validateCatalog.ts'

const root = resolve(import.meta.dirname, '..')
const entries = JSON.parse(readFileSync(resolve(root, 'src/models.json'), 'utf8')) as ValidatableEntry[]

const errors = validateCatalog(entries, (p) => existsSync(resolve(root, 'public', p.replace(/^\//, ''))), STAGE_NAMES)

if (errors.length) {
  console.error('Catalog validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'))
  process.exit(1)
}
console.log(`Catalog OK (${entries.length} model${entries.length === 1 ? '' : 's'})`)

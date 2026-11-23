import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { extractTopLevelGroups } from '../src/layers.ts'
import { STAGE_NAMES } from '../src/stages.ts'
import { validateCatalog, type ValidatableEntry } from '../src/validateCatalog.ts'
import { readGlbFileJson } from './glb.ts'

const root = resolve(import.meta.dirname, '..')
const entries = JSON.parse(readFileSync(resolve(root, 'src/models.json'), 'utf8')) as ValidatableEntry[]
const publicFile = (p: string) => resolve(root, 'public', p.replace(/^\//, ''))

const errors = validateCatalog(
  entries,
  (p) => existsSync(publicFile(p)),
  STAGE_NAMES,
  (entry) => extractTopLevelGroups(readGlbFileJson(publicFile(String(entry.glb)))),
)

if (errors.length) {
  console.error('Catalog validation failed:\n' + errors.map((e) => `  - ${e}`).join('\n'))
  process.exit(1)
}
console.log(`Catalog OK (${entries.length} model${entries.length === 1 ? '' : 's'})`)

import fs from 'node:fs';
import path from 'node:path';
const required=['app/page.tsx','app/app/page.tsx','app/layout.tsx','lib/ai/index.ts','lib/db/index.ts','lib/validation/schemas.ts','lib/validation/project.ts','README.md','.env.example','.gitignore','LICENSE','package.json','package-lock.json','tests/schemas.test.ts'];
const missing=required.filter(f=>!fs.existsSync(f));
const all=required.filter(f=>fs.existsSync(f)).map(f=>fs.readFileSync(f,'utf8')).join('\n');
const bad=['TODO','implement later','add your code here'];
const leaked=bad.filter(x=>all.toLowerCase().includes(x.toLowerCase()));
console.log(JSON.stringify({requiredFilesOk:missing.length===0,missing,placeholderMatches:leaked,envExampleHasKey:fs.readFileSync('.env.example','utf8').includes('GEMINI_API_KEY='),gitignoreProtectsSecrets:fs.readFileSync('.gitignore','utf8').includes('.env')},null,2));
process.exit(missing.length||leaked.length?1:0);

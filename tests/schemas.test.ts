import {describe,expect,it} from 'vitest';
import {PersonaGenerationSchema} from '../lib/validation/schemas';
import {ProjectSchema} from '../lib/validation/project';
import {demoProject} from '../lib/demo';
describe('research schemas',()=>{it('accepts the demo project',()=>expect(ProjectSchema.parse(demoProject).name).toBe('FocusFlow'));it('rejects malformed persona output',()=>expect(()=>PersonaGenerationSchema.parse({personas:[{name:'x'}]})).toThrow())});

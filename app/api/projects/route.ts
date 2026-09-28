import {NextResponse} from 'next/server';import {listProjects,saveProject} from '@/lib/db';import {ProjectSchema} from '@/lib/validation/project';
export async function GET(){try{return NextResponse.json({projects:listProjects()})}catch{return NextResponse.json({error:'Could not load projects.'},{status:500})}}
export async function POST(req:Request){try{const p=ProjectSchema.parse(await req.json());return NextResponse.json({project:saveProject(p)})}catch(e:any){return NextResponse.json({error:e?.issues?'Invalid project data.':'Could not save project.'},{status:400})}}

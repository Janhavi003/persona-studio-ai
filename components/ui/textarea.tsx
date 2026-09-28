import {TextareaHTMLAttributes} from 'react';
export function Textarea({className='',...p}:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={`focus-ring min-h-28 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] ${className}`} {...p}/>}

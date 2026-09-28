import {InputHTMLAttributes} from 'react';
export function Input({className='',...p}:InputHTMLAttributes<HTMLInputElement>){return <input className={`focus-ring w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--muted)] ${className}`} {...p}/>}

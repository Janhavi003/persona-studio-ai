'use client';
import {useEffect} from 'react';
export function Toast({message,onDone}:{message:string,onDone:()=>void}){useEffect(()=>{const t=setTimeout(onDone,3200);return()=>clearTimeout(t)},[onDone]);return <div className="fixed bottom-5 right-5 z-[60] rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white shadow-xl">{message}</div>}

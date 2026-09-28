export function Card({children,className='' }:{children:React.ReactNode,className?:string}){return <div className={`surface rounded-xl ${className}`}>{children}</div>}
export function CardHeader({children,className='' }:{children:React.ReactNode,className?:string}){return <div className={`p-5 ${className}`}>{children}</div>}
export function CardContent({children,className='' }:{children:React.ReactNode,className?:string}){return <div className={`px-5 pb-5 ${className}`}>{children}</div>}

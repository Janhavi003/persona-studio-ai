import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Manrope, Space_Grotesk } from 'next/font/google';

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const displayFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata={title:'Persona Studio',description:'Turn product ideas and research into structured user personas and product insights.'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en" suppressHydrationWarning><body className={`${bodyFont.variable} ${displayFont.variable}`}><ThemeProvider>{children}</ThemeProvider></body></html>
}

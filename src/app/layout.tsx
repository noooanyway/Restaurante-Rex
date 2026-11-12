import type { Metadata } from 'next';
import { restaurant } from '@/data/restaurant';
import './globals.css';
export const metadata: Metadata = { title: `${restaurant.name} — Matéria em transformação`, description: 'Cozinha contemporânea, ingredientes portugueses e combinações inesperadas. Conheça o conceito e explore a ementa do REX.', robots: {index:false,follow:false} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-PT"><body>{children}</body></html>; }

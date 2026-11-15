import type { Metadata } from 'next';
import { Lora, DM_Sans } from 'next/font/google';
import { restaurant } from '@/data/restaurant';
import './globals.css';
import './typography.css';
const editorial = Lora({subsets:['latin'],weight:['400','500'],variable:'--font-editorial',display:'swap'});
const text = DM_Sans({subsets:['latin'],weight:['400','500','600'],variable:'--font-text',display:'swap'});
export const metadata: Metadata = { title: `${restaurant.name} — Restaurante e Esplanada`, description: 'Conheça a Furna — Restaurante e Esplanada em Santo António. Consulte a ementa, os horários e as informações de reserva.', robots: {index:false,follow:false} };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="pt-PT" className={`${editorial.variable} ${text.variable}`}><body>{children}</body></html>;}

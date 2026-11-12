'use client';
import { useState } from 'react';
import { menu } from '@/data/restaurant';
export default function Menu() {
 const [active,setActive]=useState('Tudo');
 return <><div className="menu-filters flex flex-wrap gap-x-6 gap-y-2" aria-label="Filtrar ementa">{['Tudo',...menu.map(m=>m.category)].map(cat=><button key={cat} type="button" aria-pressed={active===cat} onClick={()=>setActive(cat)}>{cat}<span aria-hidden="true">↗</span></button>)}</div><p className="sr-only" role="status">{active==='Tudo'?'Ementa completa':active}</p><div className="menu-list">{menu.map((section,i)=>(active==='Tudo'||active===section.category)&&<section className="menu-category" key={section.category}><h3><sup>0{i+1}</sup>{section.category}</h3><ul>{section.dishes.map((dish,j)=><li key={j}><div><h4>{dish.name}</h4>{dish.ingredients&&<p>{dish.ingredients}</p>}</div>{dish.price&&<span className="price">{dish.price}</span>}</li>)}</ul></section>)}</div><p className="menu-note">Os restantes preços serão comunicados em breve.</p></>;
}

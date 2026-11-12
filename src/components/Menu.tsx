'use client';
import { useState } from 'react';
import { menu } from '@/data/restaurant';
export default function Menu() {
  const [active, setActive] = useState('Tudo');
  return <div className="menu-layout">
    <div className="menu-index"><p className="eyebrow">ESCOLHER UM CAPÍTULO</p>
      <div className="menu-filters" role="group" aria-label="Filtrar ementa">
        {['Tudo', ...menu.map(section => section.category)].map((category, index) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}><span className="filter-number" aria-hidden="true">{index === 0 ? '—' : `0${index}`}</span>{category}<span className="filter-mark" aria-hidden="true">●</span></button>)}
      </div><p className="menu-index-note">Os restantes preços serão<br />comunicados em breve.</p>
    </div>
    <div className="menu-list"><p className="sr-only" role="status">{active === 'Tudo' ? 'Ementa completa' : active}</p>
      {menu.map((section, index) => (active === 'Tudo' || active === section.category) && <section className="menu-category" key={section.category}>
        <h3><span className="category-number" aria-hidden="true">0{index + 1}</span>{section.category}<span className="dish-count">{String(section.dishes.length).padStart(2, '0')} pratos</span></h3>
        <ul>{section.dishes.map((dish, dishIndex) => <li key={`${dish.name}-${dishIndex}`}><div><h4>{dish.name}</h4>{dish.ingredients && <p>{dish.ingredients}</p>}</div>{dish.price && <span className="price">{dish.price}</span>}</li>)}</ul>
      </section>)}
    </div>
  </div>;
}

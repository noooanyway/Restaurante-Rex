import Image from 'next/image';
import Menu from '@/components/Menu';
import { restaurant as r, photos, menu } from '@/data/restaurant';

const pairing = menu[1].dishes[2];
export default function Home() {
  return <>
    <a href="#conteudo" className="skip-link">Saltar para o conteúdo</a>
    <header className="topbar">
      <a href="#inicio" className="small-logo" aria-label={`${r.name} — início`}>{r.name}</a>
      <span className="header-note">RESTAURANTE<br />COZINHA CONTEMPORÂNEA</span>
      <nav aria-label="Navegação principal" className="flex items-center"><a href="#conceito">A ideia</a><a href="#ementa">Ementa</a><a href="#visitar">Visitar</a></nav>
    </header>
    <main id="conteudo">
      <section className="opening" id="inicio" aria-labelledby="hero-title">
        <div className="opening-type">
          <p className="eyebrow">INGREDIENTES PORTUGUESES.<br />RELAÇÕES IMPROVÁVEIS.</p>
          <h1 id="hero-title" className="wordmark">{r.name}</h1>
          <p className="opening-line">O sabor não anda<br />em linha reta.</p>
          <a className="menu-entry" href="#ementa"><span>Sentar.<br />Escolher.</span><span aria-hidden="true">↳</span><span>Ver a ementa</span></a>
        </div>
        <figure className="opening-photo">
          <Image src={photos.garden.src} alt={photos.garden.alt} width={1400} height={2100} priority sizes="(max-width: 700px) 100vw, 50vw" />
          <figcaption><span>MATÉRIA, ANTES DE SER PRATO.</span><span>ESTUDO FOTOGRÁFICO — 01</span></figcaption>
        </figure>
        <p className="opening-footnote">Uma cozinha que começa no produto<br />e continua na curiosidade.</p>
        <a className="opening-index" href="#conceito">O QUE NOS MOVE <span aria-hidden="true">↓</span></a>
      </section>
      <section id="conceito" className="relations">
        <div className="section-top"><span className="eyebrow">01 / A IDEIA</span><span className="eyebrow">UMA COMBINAÇÃO DA NOSSA EMENTA</span></div>
        <h2 className="pairing-title"><span>{pairing.name}</span>{pairing.ingredients?.split(' | ').map(ingredient => <span key={ingredient}><b aria-hidden="true">×</b>{ingredient}</span>)}</h2>
        <div className="relations-bottom"><p className="relations-caption">Três ingredientes.<br />Outra conversa.</p><div className="concept-copy"><p>A morcela encontra a acidez da laranja fermentada e o amargo do chocolate negro. O queijo de São Jorge passa do couvert para o creme de um Paris-Brest.</p><p>No {r.name}, trabalhamos ingredientes portugueses com fermentações e técnicas contemporâneas. Interessa-nos o que acontece entre sabores: o contraste, a textura, a surpresa.</p></div></div>
      </section>
      <section className="interlude" aria-labelledby="interlude-title">
        <figure className="sea-photo"><Image src={photos.sea.src} alt={photos.sea.alt} width={1000} height={1200} sizes="(max-width: 700px) 100vw, 56vw" /><figcaption>ESTUDO FOTOGRÁFICO — 02 / MAR</figcaption></figure>
        <div className="interlude-copy"><span className="eyebrow">PRODUTO → TRANSFORMAÇÃO → MESA</span><h2 id="interlude-title">Dar tempo<br />ao sabor.</h2><p>Curar. Fermentar. Assar.<br />Mudar a matéria, descobrir<br />o que já estava lá.</p><a className="line-link" href="#ementa">Descobrir os pratos <span aria-hidden="true">↓</span></a></div>
        <p className="photo-disclaimer">Fotografias de inspiração. Não representam pratos ou espaços do {r.name}.</p>
      </section>
      <section id="ementa" className="menu-section"><div className="menu-heading"><span className="eyebrow">02 / A EMENTA</span><h2>O que vai<br />à mesa.</h2><p>Do primeiro ao último sabor.</p></div><Menu /></section>
      <section id="visitar" className="visit">
        <div className="visit-heading"><span className="eyebrow">03 / VISITAR O {r.name}</span><h2>À mesa.</h2></div>
        <div className="visit-body"><p className="visit-note">O lugar do próximo<br />encontro.</p><div className="visit-details">
          <dl><div><dt>ONDE</dt><dd>{r.address || 'Morada a anunciar.'}</dd></div><div><dt>QUANDO</dt><dd>{r.hours || 'Horários a anunciar.'}</dd></div><div><dt>CONTACTOS</dt><dd>{r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`}>{r.phone}</a>}{r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}{!r.phone && !r.email && 'Contactos disponíveis em breve.'}</dd></div></dl>
          {r.bookingUrl ? <a className="reservation" href={r.bookingUrl}>Reservar uma mesa <span aria-hidden="true">↗</span></a> : <div className="reservation"><span>Reservas</span><span className="availability">EM BREVE</span></div>}
          <p className="booking-note">{r.bookingUrl ? 'Consulte a disponibilidade no sistema de reservas.' : 'As reservas ainda não estão disponíveis. Os detalhes serão anunciados aqui.'}</p>
        </div></div>
      </section>
    </main>
    <footer><div className="footer-line"><a href="#inicio" className="small-logo">{r.name}</a><p>INGREDIENTES PORTUGUESES.<br />RELAÇÕES IMPROVÁVEIS.</p><a href="#inicio">Voltar ao início ↑</a></div><details className="credits"><summary>Fotografia e créditos</summary><p>Imagens provisórias por <a href={photos.garden.url}>Toa Heftiba</a> e <a href={photos.sea.url}>Romeio Paul</a>, via Unsplash. Utilizadas ao abrigo da <a href="https://unsplash.com/license">licença Unsplash</a>.</p></details></footer>
  </>;
}

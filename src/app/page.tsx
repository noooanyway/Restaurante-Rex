import Image from 'next/image';
import Menu from '@/components/Menu';
import ReservationRequest from '@/components/ReservationRequest';
import PaletteSelector from '@/components/PaletteSelector';
import { restaurant as r, photos } from '@/data/restaurant';


export default function Home() {
  return <>
    <a href="#conteudo" className="skip-link">Saltar para o conteúdo</a>
    <header className="topbar">
      <a href="#inicio" className="small-logo" aria-label={`${r.name} — início`}>{r.name}</a>
      <span className="header-note">RESTAURANTE<br />E ESPLANADA</span>
      <nav aria-label="Navegação principal" className="flex items-center"><a href="#ementa">Ementa</a><a href="#reservas">Reservas</a><a href="#galeria">Galeria</a><a href="#contactos">Contactos</a></nav>
    </header>
    <PaletteSelector /><main id="conteudo">
      <section className="opening" id="inicio" aria-labelledby="hero-title">
        <div className="opening-type">
          <p className="eyebrow">RESTAURANTE E ESPLANADA<br />SANTO ANTÓNIO</p>
          <h1 id="hero-title" className="wordmark">{r.name}</h1>
          <p className="opening-line">Restaurante e Esplanada</p>
          <p className="opening-description">Cozinha contemporânea com ingredientes portugueses, numa sala com 48 lugares e uma esplanada para desfrutar da sua visita.</p><div className="opening-practical"><p>{r.address}</p><p>{r.hours}</p><a href="#reservas">Informações sobre reservas</a></div><a className="menu-entry" href="#ementa"><span>Sentar.<br />Escolher.</span><span aria-hidden="true">↳</span><span>Ver a ementa</span></a>
        </div>
        <figure className="opening-photo">
          <Image src={photos.garden.src} alt={photos.garden.alt} width={1400} height={2100} priority sizes="(max-width: 700px) 100vw, 50vw" />
          <figcaption><span>MATÉRIA, ANTES DE SER PRATO.</span><span>ESTUDO FOTOGRÁFICO — 01</span></figcaption>
        </figure>
        <p className="opening-footnote">Reservas no interior, sujeitas a aprovação.<br />A esplanada não aceita reservas.</p>
        <a className="opening-index" href="#contactos">CONTACTOS E LOCALIZAÇÃO <span aria-hidden="true">↓</span></a>
      </section>
      <section id="ementa" className="menu-section"><div className="menu-heading"><span className="eyebrow">02 / A EMENTA</span><h2>Ementa</h2><p>Consulte os pratos e as combinações da nossa cozinha.</p></div><Menu /></section>
      <ReservationRequest />
      <section id="galeria" className="interlude" aria-labelledby="interlude-title">
        <figure className="sea-photo"><Image src={photos.sea.src} alt={photos.sea.alt} width={1000} height={1200} sizes="(max-width: 700px) 100vw, 56vw" /><figcaption>ESTUDO FOTOGRÁFICO — 02 / MAR</figcaption></figure>
        <div className="interlude-copy"><span className="eyebrow">GALERIA</span><h2 id="interlude-title">A Furna, em imagens</h2><p>Em breve, fotografias da sala, da esplanada e dos nossos pratos. Por agora, apresentamos imagens de inspiração, identificadas como provisórias.</p><a className="line-link" href="#ementa">Descobrir os pratos <span aria-hidden="true">↓</span></a></div>
        <p className="photo-disclaimer">Fotografias de inspiração. Não representam pratos ou espaços do {r.name}.</p>
      </section>
      <section id="contactos" className="visit">
        <div className="visit-heading"><span className="eyebrow">03 / VISITAR O {r.name}</span><h2>Contactos e localização</h2></div>
        <div className="visit-body"><p className="visit-note">Encontre-nos em<br />Santo António.</p><div className="visit-details">
          <dl><div><dt>ONDE</dt><dd>{r.address || 'Morada a anunciar.'}</dd></div><div><dt>QUANDO</dt><dd>{r.hours || 'Horários a anunciar.'}</dd></div><div><dt>CONTACTOS</dt><dd>{r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`}>{r.phone}</a>}{r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}{!r.phone && !r.email && 'Contactos disponíveis em breve.'}</dd></div></dl>
          {r.bookingUrl ? <a className="reservation" href={r.bookingUrl}>Reservar uma mesa <span aria-hidden="true">↗</span></a> : <div className="reservation"><span>Reservas</span><span className="availability">EM BREVE</span></div>}
          <p className="booking-note">{r.bookingUrl ? 'Consulte a disponibilidade no sistema de reservas.' : 'As reservas ainda não estão disponíveis. Os detalhes serão anunciados aqui.'}</p>
        </div></div>
      </section>
    </main>
    <footer><div className="footer-line"><a href="#inicio" className="small-logo">{r.name}</a><p>RESTAURANTE E ESPLANADA<br />SANTO ANTÓNIO</p><a href="#inicio">Voltar ao início ↑</a></div><div className="social-placeholders" aria-label="Redes sociais"><span>Segue a Furna</span><span>Instagram <small>Em breve</small></span><span>Facebook <small>Em breve</small></span></div><details className="credits"><summary>Fotografia e créditos</summary><p>Imagens provisórias por <a href={photos.garden.url}>Toa Heftiba</a> e <a href={photos.sea.url}>Romeio Paul</a>, via Unsplash. Utilizadas ao abrigo da <a href="https://unsplash.com/license">licença Unsplash</a>.</p></details></footer>
  </>;
}

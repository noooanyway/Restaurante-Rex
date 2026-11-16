'use client';
import {useEffect,useState} from 'react';
type Booking={id:string;date:string;name:string;time:string;people:number;children:number;babies:number;chair:number;phone:string;message:string;status:string;table_ids:string};
type Table={id:number;seats:number;active:number};
type Props={bookings:Booking[];tables:Table[];date:string;setDate:(date:string)=>void;call:(path:string)=>Promise<unknown>;version:number};
const end=(time:string)=>{const [h,m]=time.split(':').map(Number);return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`};
const assigned=(b:Booking)=>{try{const ids=JSON.parse(b.table_ids);return Array.isArray(ids)?ids:[]}catch{return []}};
export default function TableAgenda({bookings,tables,date,setDate,call,version}:Props){
 const [filter,setFilter]=useState<'all'|'occupied'>('all');
 const [agenda,setAgenda]=useState<Booking[]>([]),[error,setError]=useState('');
 useEffect(()=>{if(!date){setAgenda([]);return}let live=true;call(`/admin/table-agenda?date=${date}`).then(r=>{if(live){setAgenda((r as {bookings:Booking[]}).bookings);setError('')}}).catch(()=>{if(live){setAgenda([]);setError('Não foi possível carregar a agenda.')}});return()=>{live=false}},[date,version]);
 const day=agenda.map(b=>({...b,...bookings.find(item=>item.id===b.id)})).sort((a,b)=>a.time.localeCompare(b.time));
 const occupied=new Set(day.flatMap(assigned));
 const shown=tables.filter(t=>t.active&&(filter==='all'||occupied.has(t.id)));
 return <section className="service-board" aria-labelledby="agenda-title">
  <div className="service-board-head"><div><span className="service-kicker">FURNA · SALA INTERIOR</span><h2 id="agenda-title">O serviço, mesa a mesa.</h2><p>Escolhe um dia para consultar todos os grupos e horários. Uma reserva ocupa a mesa durante uma hora.</p></div><label className="service-date">Data do serviço<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div>
  {error&&<p role="alert">{error}</p>}<div className="service-stats"><div><span>Reservas no dia</span><strong>{day.length}</strong></div><div><span>Pessoas</span><strong>{day.reduce((n,b)=>n+b.people,0)}</strong></div><div><span>A aguardar decisão</span><strong>{day.filter(b=>b.status==='pending').length}</strong></div><div><span>Mesas com reservas</span><strong>{occupied.size}<small> / {tables.filter(t=>t.active).length}</small></strong></div></div>
  <div className="service-list-head"><div><span className="service-kicker">AGENDA DO DIA</span><h3>Mesas e grupos</h3></div><div className="service-filters" aria-label="Filtrar mesas"><button type="button" aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>Todas</button><button type="button" aria-pressed={filter==='occupied'} onClick={()=>setFilter('occupied')}>Com reservas</button></div></div>
  {!date?<p>Escolhe uma data para consultar a agenda.</p>:<div className="service-grid">{shown.map(t=>{const list=day.filter(b=>assigned(b).includes(t.id));return <article className={`service-table ${list.length?'has-bookings':''}`} key={t.id}><header><div><span className="service-kicker">MESA</span><h4>{String(t.id).padStart(2,'0')}</h4></div><span>{t.seats} lugares</span></header>{list.length===0?<p className="service-empty">Sem reservas neste dia</p>:<ul>{list.map(b=><li key={b.id}><div className="service-time"><strong>{b.time} — {end(b.time)}</strong><span className={`service-status ${b.status}`}>{b.status==='pending'?'Pendente':'Confirmada'}</span></div>{bookings.some(item=>item.id===b.id)?<a href={`#reserva-${b.id}`}><strong>{b.name}</strong></a>:<strong>{b.name}</strong>}<p>{b.people} {b.people===1?'pessoa':'pessoas'}{b.children?` · ${b.children} criança${b.children===1?'':'s'}`:''}{b.babies?` · ${b.babies} bebé${b.babies===1?'':'s'}`:''}</p>{b.chair?<small>Cadeira de bebé</small>:null}{b.message?<small>Tem observações</small>:null}{bookings.some(item=>item.id===b.id)?<a className="service-detail" href={`#reserva-${b.id}`}>Ver detalhes e gerir ↗</a>:<small>Detalhes não carregados na lista de pedidos.</small>}</li>)}</ul>}</article>})}</div>}{date&&shown.length===0&&<p>Não há mesas com reservas nesta data.</p>}
 </section>;
}

import assert from 'node:assert/strict';
const token=process.env.FURNA_TEST_TOKEN;
if(!token){console.error('Usa cloudflare/test-online.ps1 para introduzir a chave em privado.');process.exit(1)}
const base=process.env.FURNA_TEST_BASE||'https://furna-reservas.badduckstudio.workers.dev',date='2035-02-06';
const headers={'Content-Type':'application/json',Authorization:`Bearer ${token}`,Origin:'https://noooanyway.github.io'};
async function call(path,method='GET',data){const r=await fetch(base+path,{method,headers,body:data?JSON.stringify(data):undefined});const body=await r.json();return {status:r.status,body}}
const ids=[];let block;
try{
 let r=await call('/admin/table-agenda?date='+date);assert.equal(r.status,200,'Acesso ou agenda');assert.equal(r.body.bookings.length,0,'A data de teste já contém reservas; teste interrompido');
 const d={date,time:'12:00',name:'TESTE - ignorar',phone:'900000000',email:'',people:4,children:0,babies:0,chair:false,message:'Dados fictícios'};
 r=await call('/admin/manual','POST',d);assert.equal(r.status,201,'Criar reserva');ids.push(r.body.id);
 r=await call('/admin/manual','POST',{...d,time:'13:15'});assert.equal(r.status,201,'Criar reserva seguinte');ids.push(r.body.id);
 r=await call('/admin/table-agenda?date='+date);assert.equal(r.status,200);assert(ids.every(id=>r.body.bookings.some(b=>b.id===id)),'Agenda deve mostrar ambas as reservas');const one=r.body.bookings.find(b=>b.id===ids[0]),two=r.body.bookings.find(b=>b.id===ids[1]);assert.deepEqual(JSON.parse(one.table_ids),JSON.parse(two.table_ids),'Mesma mesa pode ser reutilizada');
 r=await call('/admin/contact','PATCH',{id:ids[0],name:'TESTE - editado',phone:'900000000',email:'',message:'Observação fictícia'});assert.equal(r.status,200,'Editar contactos');
 r=await call('/admin/edit','PATCH',{id:ids[1],date,time:'13:30',people:4});assert.equal(r.status,200,'Alterar hora');
 r=await call('/admin/blocks','POST',{date,start:'12:15',end:'12:45',reason:'TESTE'});assert.equal(r.status,409,'Bloqueio sobre reserva tem de ser recusado');
 r=await call('/admin/blocks','POST',{date,start:'19:00',end:'20:00',reason:'TESTE'});assert.equal(r.status,201,'Criar bloqueio');block=r.body.id;
 r=await call('/admin/availability?date='+date);assert.equal(r.status,200);assert(!r.body.slots.some(s=>s.time==='19:00'),'Disponibilidade respeita bloqueio');
 r=await call('/admin/manual','POST',{...d,time:'19:00'});assert.equal(r.status,409,'Reserva em bloqueio tem de ser recusada');
 console.log('PASS: agenda, reutilização de mesa, contactos, alteração, bloqueios e conflitos.');
} catch(e){console.error('FALHOU:',e.message);process.exitCode=1}
finally{
 let cleanup=true;
 if(block){try{const r=await call('/admin/unblock','POST',{id:block});if(r.status!==200)cleanup=false}catch{cleanup=false}}
 for(const id of ids){try{const r=await call('/admin/bookings','PATCH',{id,status:'cancelled'});if(r.status!==200)cleanup=false}catch{cleanup=false}}
 if(cleanup)console.log('PASS: reservas fictícias canceladas e bloqueio de teste removido.');else{console.error('ATENÇÃO: verificar e cancelar os registos TESTE no painel.');process.exitCode=1}
}


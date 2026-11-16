import assert from 'node:assert/strict';const base=process.env.TEST_BASE||'http://127.0.0.1:8794',headers={'Content-Type':'application/json',Authorization:'Bearer teste-local-furna',Origin:'https://noooanyway.github.io'};
async function req(path,method='GET',body){const r=await fetch(base+path,{method,headers,body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()}}
const date='2030-02-05';let r=await req('/admin/blocks','POST',{date,start:'13:00',end:'14:00',reason:'Evento'});assert.equal(r.status,201);const block=r.data.id;
let a=await req('/admin/availability?date='+date);assert(!a.data.slots.some(s=>s.time==='12:15'));assert(a.data.slots.some(s=>s.time==='12:00'));assert(a.data.slots.some(s=>s.time==='14:00'));a=await req('/availability?date='+date);assert(!a.data.slots.some(s=>s.time==='12:15'));assert(a.data.slots.some(s=>s.time==='12:00'));assert(a.data.slots.some(s=>s.time==='14:00'));
const d={date,time:'13:15',name:'Teste',phone:'900000000',people:4,children:0,babies:0,chair:false,message:'',email:''};assert.equal((await req('/bookings','POST',d)).status,409);assert.equal((await req('/admin/manual','POST',d)).status,409);
r=await req('/admin/manual','POST',{...d,time:'12:00'});assert.equal(r.status,201);const id=r.data.id;
assert.equal((await req('/admin/edit','PATCH',{id,date,time:'13:15',people:4})).status,409);
assert.equal((await req('/admin/blocks','POST',{date,start:'12:15',end:'12:45',reason:''})).status,409);
assert.equal((await req('/admin/unblock','POST',{id:block})).status,200);assert.equal((await req('/admin/edit','PATCH',{id,date,time:'13:15',people:4})).status,200);
assert.equal((await req('/admin/position','POST',{id:1,x:3,y:2})).status,200);const floor=await req('/admin/floor?date='+date+'&time=13:15');assert.deepEqual([floor.data.tables[0].x,floor.data.tables[0].y],[3,2]);
console.log('PASS: bloqueio, limites adjacentes, pedidos, alteracoes e posicao persistida.');

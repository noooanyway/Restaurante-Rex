import assert from 'node:assert/strict';
const base='http://127.0.0.1:8788';
async function request(path,method='GET',data,token='teste-local-furna'){const r=await fetch(base+path,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});return {status:r.status,body:await r.json()};}
const date='2030-01-08';const availability=async()=>{const r=await request('/admin/availability?date='+date);assert.equal(r.status,200);return r.body.slots};
assert.equal((await request('/admin','GET',null,'senha-errada')).status,401);
assert.equal((await request('/admin/availability?date='+date,'GET',null,'errada')).status,401);
assert.equal((await request('/admin/availability?date=2030-02-30')).status,400);
assert.equal((await request('/admin/availability?date=2030-01-07')).body.slots.length,0);
let slots=await availability();assert.equal(slots.find(s=>s.time==='12:00').tables,9);assert.equal(slots.find(s=>s.time==='12:30').tables,9);assert.equal(slots.find(s=>s.time==='13:00').tables,12);
assert.equal((await request('/admin/bookings','PATCH',{id:'teste-aprovar',status:'approved'})).status,200);
assert.equal((await request('/admin/bookings','PATCH',{id:'teste-recusar',status:'rejected'})).status,200);
assert.equal((await request('/admin/bookings','PATCH',{id:'teste-cancelar',status:'cancelled'})).status,200);
slots=await availability();assert.deepEqual(slots.find(s=>s.time==='12:00').availableIds,[2,3,4,5,6,7,8,9,10,11,12]);assert.equal(slots.find(s=>s.time==='12:30').tables,11);assert.equal(slots.find(s=>s.time==='13:00').tables,12);
assert.equal((await request('/admin/bookings','PATCH',{id:'teste-recusar',status:'approved'})).status,409);
assert.equal((await request('/admin/tables','POST',{seats:2})).status,201);
slots=await availability();assert.equal(slots.find(s=>s.time==='12:00').tables,12);assert.equal(slots.find(s=>s.time==='12:00').seats,46);
assert.equal((await request('/bookings','POST',{})).status,404);
console.log('PASS: D1 local isolada; ocupacao, sobreposicao, libertacao, acesso, mesa extra e segunda-feira.');

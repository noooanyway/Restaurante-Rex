import assert from 'node:assert/strict';
const base='http://127.0.0.1:8792';const headers={'Content-Type':'application/json',Authorization:'Bearer teste-local-furna'};
async function request(path,method='GET',data,auth=true){const r=await fetch(base+path,{method,headers:auth?headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json()};}
assert.equal((await request('/admin/floor?date=2030-01-08&time=12:30','GET',undefined,false)).status,401);
let floor=await request('/admin/floor?date=2030-01-08&time=12:30');assert.equal(floor.status,200);assert.equal(floor.data.tables.length,12);assert.equal(floor.data.bookings.length,3);
assert.equal((await request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[2]})).status,409);
assert.equal((await request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[4,5]})).status,200);
floor=await request('/admin/floor?date=2030-01-08&time=12:30');assert.deepEqual(JSON.parse(floor.data.bookings.find(b=>b.id==='teste-aprovar').table_ids),[4,5]);
assert.equal((await request('/admin/tables','PATCH',{id:4,seats:6,active:true})).status,409);
assert.equal((await request('/admin/tables','PATCH',{id:6,seats:6,active:false})).status,200);
assert.equal((await request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[6]})).status,409);
assert.equal((await request('/admin/tables','PATCH',{id:6,seats:6,active:true})).status,200);
assert.equal((await request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[6]})).status,200);
assert.equal((await request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[6,6]})).status,400);
const changes=await Promise.all([request('/admin/assign','PATCH',{id:'teste-aprovar',tableIds:[7]}),request('/admin/assign','PATCH',{id:'teste-recusar',tableIds:[7]})]);assert.deepEqual(changes.map(x=>x.status).sort(),[200,409]);
console.log('PASS: visualizacao, ocupacao, juntar mesas, capacidade, ativacao, concorrencia e acesso.');

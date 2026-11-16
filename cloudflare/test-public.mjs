import assert from 'node:assert/strict';
const base='http://127.0.0.1:8790',headers={'Content-Type':'application/json',Origin:'https://noooanyway.github.io'};
const body={date:'2030-01-09',time:'12:00',name:'Cliente ficticio',phone:'900000000',email:'',people:48,children:0,babies:0,chair:false,message:''};
const send=()=>fetch(base+'/bookings',{method:'POST',headers,body:JSON.stringify(body)});const [a,b]=await Promise.all([send(),send()]);assert.deepEqual([a.status,b.status].sort(),[201,409]);const result=await (a.status===201?a:b).json();assert.equal(result.status,'pending');assert.equal(result.expiresInMinutes,60);
const avail=await (await fetch(base+'/availability?date=2030-01-09')).json();assert.equal(avail.slots.find(s=>s.time==='12:00').tables,0);assert.equal(avail.slots.find(s=>s.time==='12:30').tables,0);assert.equal(avail.slots.find(s=>s.time==='13:00').tables,12);
const reject=await fetch(base+'/admin/bookings',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer teste-local-furna'},body:JSON.stringify({id:result.id,status:'rejected'})});assert.equal(reject.status,200);
const after=await (await fetch(base+'/availability?date=2030-01-09')).json();assert.equal(after.slots.find(s=>s.time==='12:00').tables,12);
assert.equal((await fetch(base+'/bookings',{method:'POST',headers:{...headers,Origin:'https://example.com'},body:JSON.stringify(body)})).status,403);
console.log('PASS: pedido publico pendente, concorrencia, sobreposicao, recusa e origem.');

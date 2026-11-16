import assert from 'node:assert/strict';
const base='http://127.0.0.1:8790',auth={Authorization:'Bearer teste-local-furna','Content-Type':'application/json'};
const a=await (await fetch(base+'/admin',{headers:auth})).json();assert.equal(a.bookings.find(b=>b.id==='teste-recusar').status,'expired');
let r=await fetch(base+'/admin/bookings',{method:'PATCH',headers:auth,body:JSON.stringify({id:'teste-recusar',status:'approved'})});assert.equal(r.status,409);
const avail=await (await fetch(base+'/availability?date=2030-01-08')).json();assert.equal(avail.slots.find(s=>s.time==='12:00').tables,10);
console.log('PASS: expiracao liberta mesa e impede aprovacao tardia.');

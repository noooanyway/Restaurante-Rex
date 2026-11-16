import assert from 'node:assert/strict';
const base='http://127.0.0.1:8788';const headers={'Content-Type':'application/json',Authorization:'Bearer teste-local-furna'};
const body={date:'2030-01-09',time:'12:00',name:'Teste telefone',phone:'900000000',people:48,children:0,babies:0,chair:false,message:''};
const send=()=>fetch(base+'/admin/manual',{method:'POST',headers,body:JSON.stringify(body)});
const [a,b]=await Promise.all([send(),send()]);assert.deepEqual([a.status,b.status].sort(),[201,409]);
const result=await (a.status===201?a:b).json();const cancel=await fetch(base+'/admin/bookings',{method:'PATCH',headers,body:JSON.stringify({id:result.id,status:'cancelled'})});assert.equal(cancel.status,200);
const c=await send();assert.equal(c.status,201);
console.log('PASS: pedido telefonico, concorrencia e libertacao apos cancelamento.');

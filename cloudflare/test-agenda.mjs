import assert from 'node:assert/strict';
const base='http://127.0.0.1:8788';const headers={'Content-Type':'application/json',Authorization:'Bearer teste-local-furna'};
async function req(path,method='GET',body){const r=await fetch(base+path,{method,headers,body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
const d={date:'2030-01-11',time:'12:00',name:'Grupo ficticio A',phone:'900000000',people:4,children:0,babies:0,chair:false,message:''};
const a=await req('/admin/manual','POST',d);assert.equal(a.status,201);const b=await req('/admin/manual','POST',{...d,time:'13:15',name:'Grupo ficticio B'});assert.equal(b.status,201);
const agenda=await req('/admin/table-agenda?date=2030-01-11');assert.equal(agenda.status,200);const first=agenda.data.bookings.find(x=>x.id===a.data.id),second=agenda.data.bookings.find(x=>x.id===b.data.id);assert.deepEqual(JSON.parse(first.table_ids),JSON.parse(second.table_ids));assert.equal(second.time,'13:15');
assert.equal((await req('/admin/contact','PATCH',{id:a.data.id,name:'Teste alterado',phone:'900000001',email:'teste@example.test',message:'Nota ficticia'})).status,200);
const detail=await req('/admin');const changed=detail.data.bookings.find(x=>x.id===a.data.id);assert.equal(changed.name,'Teste alterado');assert.equal(changed.email,'teste@example.test');
assert.equal((await req('/admin/contact','PATCH',{id:a.data.id,name:'',phone:'x',email:'',message:''})).status,400);
console.log('PASS: agenda por mesa, intervalos de 15 minutos, contactos e validacao.');

import assert from 'node:assert/strict';
const base=process.env.TEST_BASE || 'http://127.0.0.1:8788';const headers={'Content-Type':'application/json',Authorization:'Bearer teste-local-furna'};
async function call(path,method,body){const r=await fetch(base+path,{method,headers,body:JSON.stringify(body)});return {status:r.status,body:await r.json()}}
const d={date:'2030-01-10',time:'12:00',name:'Alteração teste',phone:'900000000',people:4,children:0,babies:0,chair:false,message:''};
const a=await call('/admin/manual','POST',d);assert.equal(a.status,201);const b=await call('/admin/manual','POST',{...d,time:'13:00',people:44});assert.equal(b.status,201);
let r=await call('/admin/edit','PATCH',{id:a.body.id,date:d.date,time:'13:00',people:8});assert.equal(r.status,409);
r=await call('/admin/edit','PATCH',{id:a.body.id,date:d.date,time:'13:00',people:4});assert.equal(r.status,200);
console.log('PASS: alterar reserva com revalidação de capacidade e conflito.');

import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const temp=mkdtempSync(join(tmpdir(),'furna-test-'));
const child=spawn(process.execPath,['server/index.mjs'],{env:{...process.env,PORT:'4011',BOOKING_DB:join(temp,'test.sqlite'),ADMIN_TOKEN:'test-only-token'},stdio:['ignore','pipe','pipe']});
await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);});
const request=async(path,method='GET',body,auth=false)=>{const r=await fetch('http://127.0.0.1:4011'+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer test-only-token'}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()}};
try{const d='2030-01-08';assert.equal((await request('/availability?date='+d)).data.slots[0].tables,12);const body={date:d,time:'12:00',name:'Teste',phone:'900000000',people:48,children:0,babies:0,message:''};const a=await request('/bookings','POST',body);assert.equal(a.status,201);assert.equal((await request('/bookings','POST',body)).status,409);assert.equal((await request('/availability?date='+d)).data.slots[1].tables,0);assert.equal((await request('/admin')).status,401);assert.equal((await request('/admin/bookings','PATCH',{id:a.data.id,status:'rejected'},true)).status,200);assert.equal((await request('/availability?date='+d)).data.slots[0].tables,12);assert.equal((await request('/availability?date=2030-01-07')).data.slots.length,0);console.log('PASS: disponibilidade, sobreposição, recusa, autenticação e segunda-feira.');}finally{child.kill();await new Promise(r=>child.once('exit',r));rmSync(temp,{recursive:true,force:true});}

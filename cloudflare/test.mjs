import assert from 'node:assert/strict';
import worker from './worker.mjs';
let limited=false,queries=0;
const env={ADMIN_TOKEN:'senha-teste',ADMIN_LIMIT:{limit:async()=>({success:!limited})},DB:{prepare(sql){return {sql}},async batch(){queries++;return [{results:[]},{results:[{id:1,seats:4}]}]}}};
let r=await worker.fetch(new Request('https://example.test/admin'),env);assert.equal(r.status,401);assert.equal(queries,0);
r=await worker.fetch(new Request('https://example.test/admin',{headers:{Authorization:'Bearer senha-teste',Origin:'https://noooanyway.github.io'}}),env);assert.equal(r.status,200);assert.equal((await r.json()).tables.length,1);assert.equal(r.headers.get('Access-Control-Allow-Origin'),'https://noooanyway.github.io');
limited=true;r=await worker.fetch(new Request('https://example.test/admin',{headers:{Authorization:'Bearer senha-teste'}}),env);assert.equal(r.status,429);
r=await worker.fetch(new Request('https://example.test/bookings',{method:'POST'}),env);assert.equal(r.status,404);
console.log('PASS: autenticação, limite, origem e reservas públicas desativadas.');

import assert from 'node:assert/strict';import {sendNotification} from './email.mjs';
const env={RESEND_API_KEY:'test',EMAIL_FROM:'Furna <reservas@example.test>',RESTAURANT_EMAIL:'furna.restaurante00@gmail.com'};const booking={id:'teste',notificationId:17,date:'2030-01-01',time:'12:00',people:2,email:'cliente@example.test'};
let sent;const mock=async(url,options)=>{sent={url,options,body:JSON.parse(options.body)};return new Response('{}',{status:200})};
await sendNotification(env,'pending',booking,mock);assert.deepEqual(sent.body.to,[env.RESTAURANT_EMAIL]);assert.ok(!sent.body.text.includes('cliente@example.test'));
await sendNotification(env,'approved',booking,mock);assert.deepEqual(sent.body.to,[booking.email]);assert.equal(sent.options.headers['Idempotency-Key'],'furna-approved-17');
assert.equal((await sendNotification(env,'approved',{...booking,email:null},mock)).skipped,true);
await assert.rejects(()=>sendNotification(env,'approved',booking,async()=>new Response('',{status:500})));console.log('PASS: destinatários, sem email, idempotência e falha do fornecedor.');

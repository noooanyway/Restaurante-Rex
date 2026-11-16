// Private-management prototype. No public booking endpoint is enabled.
// ADMIN_TOKEN is configured as a Cloudflare secret, never in this file.
const origin = 'https://noooanyway.github.io';
const enc = new TextEncoder();
async function sameSecret(a,b){if(!a||!b)return false;const [x,y]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(a)),crypto.subtle.digest('SHA-256',enc.encode(b))]);const x8=new Uint8Array(x),y8=new Uint8Array(y);let difference=0;for(let i=0;i<x8.length;i++)difference|=x8[i]^y8[i];return difference===0;}
export default {async fetch(request,env){
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if(request.headers.get('Origin')===origin)headers['Access-Control-Allow-Origin']=origin;
 const send=(status,data)=>new Response(JSON.stringify(data),{status,headers});
 if(request.method==='OPTIONS'){if(request.headers.get('Origin')!==origin)return send(403,{error:'Origem não autorizada.'});return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, PATCH, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type'}});}
 const path=new URL(request.url).pathname; if(!path.startsWith('/admin'))return send(404,{error:'Nao encontrado.'});
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';if(!(await env.ADMIN_LIMIT.limit({key:ip})).success)return send(429,{error:'Demasiadas tentativas. Aguarde e volte a tentar.'});
 if(!await sameSecret(request.headers.get('Authorization')?.replace(/^Bearer /,''),env.ADMIN_TOKEN))return send(401,{error:'Acesso não autorizado.'});
 if(request.method==='POST'&&path==='/admin/tables'){let data;try{data=await request.json()}catch{return send(400,{error:'Pedido inv�lido.'})}if(!Number.isInteger(data.seats)||data.seats<1||data.seats>20)return send(400,{error:'Capacidade inv�lida.'});await env.DB.prepare('INSERT INTO dining_tables(seats) VALUES (?)').bind(data.seats).run();return send(201,{ok:true});}
 if(request.method==='PATCH'&&path==='/admin/bookings'){let data;try{data=await request.json()}catch{return send(400,{error:'Pedido inv�lido.'})}if(!['approved','rejected','cancelled'].includes(data.status)||typeof data.id!=='string')return send(400,{error:'Estado inv�lido.'});const previous=data.status==='cancelled'?'approved':'pending';const result=await env.DB.prepare('UPDATE reservations SET status=? WHERE id=? AND status=?').bind(data.status,data.id,previous).run();if(!result.meta.changes)return send(409,{error:'Pedido inexistente ou j� alterado.'});return send(200,{ok:true});}
 if(request.method!=='GET'||path!=='/admin')return send(404,{error:'N�o encontrado.'});
 const [bookings,tables]=await env.DB.batch([env.DB.prepare('SELECT * FROM reservations ORDER BY date,time LIMIT 500'),env.DB.prepare('SELECT id,seats FROM dining_tables WHERE active=1 ORDER BY id')]);
 return send(200,{bookings:bookings.results,tables:tables.results});
}};

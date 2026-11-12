import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID, timingSafeEqual } from 'node:crypto';
const db = new DatabaseSync(process.env.BOOKING_DB || 'bookings.sqlite');
db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS tables(id INTEGER PRIMARY KEY, seats INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY,date TEXT,time TEXT,name TEXT,phone TEXT,people INTEGER,children INTEGER,babies INTEGER,chair INTEGER,message TEXT,status TEXT,table_ids TEXT);`);
if (!db.prepare('SELECT count(*) n FROM tables').get().n) for(let i=1;i<=12;i++) db.prepare('INSERT INTO tables VALUES (?,4)').run(i);
const slots=['12:00','12:30','13:00','13:30','14:00','19:00','19:30','20:00','20:30','21:00'];
const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
const localNow=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Atlantic/Azores',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());
function valid(date,time){const d=new Date(date+'T12:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(date)&&!isNaN(d)&&d.toISOString().slice(0,10)===date&&d.getUTCDay()!==1&&slots.includes(time)&&`${date} ${time}`>localNow();}
function free(date,time){const occupied=new Set();for(const b of db.prepare("SELECT time,table_ids FROM bookings WHERE date=? AND status IN ('pending','approved')").all(date)){if(Math.abs(minutes(b.time)-minutes(time))<60)JSON.parse(b.table_ids).forEach(id=>occupied.add(id));}return db.prepare('SELECT * FROM tables ORDER BY seats,id').all().filter(t=>!occupied.has(t.id));}
const allowed=(process.env.ALLOWED_ORIGINS||'http://127.0.0.1:3003,http://localhost:3003').split(',');
const admin=req=>{const token=process.env.ADMIN_TOKEN;const supplied=req.headers.authorization?.replace(/^Bearer /,'');return token&&supplied&&token.length===supplied.length&&timingSafeEqual(Buffer.from(token),Buffer.from(supplied));};
http.createServer(async(req,res)=>{
 const origin=req.headers.origin;if(origin&&!allowed.includes(origin)){res.writeHead(403);return res.end();}if(origin)res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Cache-Control','no-store');res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS');
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 try{const url=new URL(req.url,'http://localhost');
 if(req.method==='GET'&&url.pathname==='/availability'){const date=url.searchParams.get('date')||'';return send(200,{slots:slots.filter(t=>valid(date,t)).map(time=>({time,tables:free(date,time).length,seats:free(date,time).reduce((n,t)=>n+t.seats,0)}))});}
 let raw='';if(req.method!=='GET'){for await(const chunk of req){raw+=chunk;if(raw.length>12000)return send(413,{error:'Pedido demasiado grande.'});}}const data=raw?JSON.parse(raw):{};
 if(req.method==='POST'&&url.pathname==='/bookings'){
 const {date,time,name,phone,people,children=0,babies=0,chair=false,message=''}=data;
 if(!valid(date,time)||typeof name!=='string'||!name.trim()||name.length>120||typeof phone!=='string'||!/^\+?[\d\s()-]{7,30}$/.test(phone)||![people,children,babies].every(Number.isInteger)||people<1||people>48||children<0||babies<0||children+babies>people||typeof message!=='string'||message.length>2000)return send(400,{error:'Verifique a data, horário, contactos e número de pessoas.'});
 db.exec('BEGIN IMMEDIATE');try{const selected=[];let seats=0;for(const t of free(date,time)){selected.push(t.id);seats+=t.seats;if(seats>=people)break;}if(seats<people){db.exec('ROLLBACK');return send(409,{error:'Já não há mesas suficientes neste horário. Escolha outro.'});}const id=randomUUID();db.prepare('INSERT INTO bookings VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(id,date,time,name.trim(),phone,people,children,babies,chair?1:0,message,'pending',JSON.stringify(selected));db.exec('COMMIT');return send(201,{id,status:'pending'});}catch(e){db.exec('ROLLBACK');throw e;}}
 if(url.pathname.startsWith('/admin')){if(!admin(req))return send(401,{error:'Acesso reservado ao restaurante.'});
 if(req.method==='GET'&&url.pathname==='/admin')return send(200,{bookings:db.prepare('SELECT * FROM bookings ORDER BY date,time').all(),tables:db.prepare('SELECT * FROM tables').all()});
 if(req.method==='POST'&&url.pathname==='/admin/tables'){if(!Number.isInteger(data.seats)||data.seats<1||data.seats>20)return send(400,{error:'Capacidade inválida.'});db.prepare('INSERT INTO tables(seats) VALUES (?)').run(data.seats);return send(201,{ok:true});}
 if(req.method==='PATCH'&&url.pathname==='/admin/bookings'){if(!['approved','rejected','cancelled'].includes(data.status))return send(400,{error:'Estado inválido.'});const row=db.prepare('SELECT status FROM bookings WHERE id=?').get(data.id);if(!row||!['pending','approved'].includes(row.status))return send(409,{error:'Este pedido já foi encerrado.'});db.prepare('UPDATE bookings SET status=? WHERE id=?').run(data.status,data.id);return send(200,{ok:true});}}
 send(404,{error:'Não encontrado.'});
 }catch{send(400,{error:'Não foi possível processar o pedido.'});}
}).listen(Number(process.env.PORT||4000),process.env.HOST||'127.0.0.1',()=>console.log('Serviço de reservas ativo na porta '+(process.env.PORT||4000)));

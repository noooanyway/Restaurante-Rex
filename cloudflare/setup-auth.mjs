import {Secret,TOTP} from 'otpauth';
import {randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
const secret=new Secret({size:20});const totp=new TOTP({issuer:'Furna',label:'Gestao',secret});
const rl=createInterface({input:process.stdin,output:process.stdout});
console.log('\nNo telemóvel, abre a aplicação de autenticação e escolhe adicionar conta por chave manual.');
console.log('Nome da conta: Furna - Gestão');
console.log('Chave privada (não partilhes nem fotografes): '+secret.base32);
console.log('Tipo: baseado no tempo.');
const code=(await rl.question('\nEscreve o código de 6 dígitos da aplicação para confirmar: ')).trim();rl.close();
if(!/^\d{6}$/.test(code)||totp.validate({token:code,window:1})===null){console.error('Código inválido; nenhuma configuração foi guardada. Tenta novamente.');process.exit(1)}
function put(name,value){const r=spawnSync('cmd.exe',['/d','/s','/c',`npx.cmd wrangler secret put ${name}`],{input:value+'\n',encoding:'utf8',windowsHide:true,timeout:120000});if(r.error||r.status!==0)throw Error('Não foi possível guardar '+name+' na Cloudflare. Verifica a sessão Wrangler.');}
try{put('ADMIN_TOTP_SECRET',secret.base32);put('ADMIN_SESSION_SECRET',randomBytes(32).toString('hex'));console.log('Configuração guardada. A autenticação nova ainda precisa de ser publicada e testada.');}
catch(e){console.error(e.message);process.exitCode=1}

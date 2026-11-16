// Run locally. OAuth material stays in memory and is passed to Wrangler through stdin.
import {OAuth2Client} from 'google-auth-library';
import {createServer} from 'node:http';
import {randomBytes} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {createInterface} from 'node:readline/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const rl=createInterface({input:process.stdin,output:process.stdout});
const path=(await rl.question('Caminho do JSON OAuth descarregado da Google (fora do repositorio): ')).trim().replace(/^"|"$/g,'');rl.close();
let config;try{config=JSON.parse(await readFile(path,'utf8')).installed}catch{throw Error('Nao foi possivel ler o JSON OAuth.');}
if(!config?.client_id||!config?.client_secret)throw Error('Escolhe credenciais do tipo Aplicacao para computador.');
const state=randomBytes(32).toString('hex');
const server=createServer();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
const redirect=`http://127.0.0.1:${server.address().port}/callback`;
const oauth=new OAuth2Client(config.client_id,config.client_secret,redirect);
const {codeVerifier,codeChallenge}=await oauth.generateCodeVerifierAsync();
let timer;
const received=new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(Error('Autorizacao expirou. Executa novamente.')),300000);server.on('request',(req,res)=>{const url=new URL(req.url,redirect);res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','text/plain; charset=utf-8');if(url.pathname!=='/callback'){res.writeHead(404);res.end();return}if(url.searchParams.get('state')!==state){res.writeHead(400);res.end('Pedido invalido.');return}if(url.searchParams.has('error')){res.end('Autorizacao recusada. Volta ao terminal.');reject(Error('Autorizacao recusada.'));return}const code=url.searchParams.get('code');if(!code){res.writeHead(400);res.end('Codigo em falta.');return}res.end('Autorizacao recebida. Volta ao terminal para verificar o resultado.');resolve(code);});});
console.log('\nAbre este endereco no navegador. Inicia sessao apenas como furna.restaurante00@gmail.com e autoriza o envio. Nao partilhes o URL de retorno nem codigos.\n');
console.log(oauth.generateAuthUrl({access_type:'offline',prompt:'consent',scope:['https://www.googleapis.com/auth/gmail.send'],state,code_challenge:codeChallenge,code_challenge_method:'S256',login_hint:'furna.restaurante00@gmail.com'}));
async function put(name,value){await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url)),'secret','put',name],{cwd:root,stdio:['pipe','pipe','pipe'],windowsHide:true});child.on('error',()=>reject(Error('Nao foi possivel iniciar Wrangler.')));child.stdout.resume();child.stderr.resume();child.on('close',code=>code===0?resolve():reject(Error('Falhou a configuracao de '+name+'. Verifica a sessao Wrangler.')));child.stdin.end(value+'\n');});}
try{const code=await received;const {tokens}=await oauth.getToken({code,codeVerifier});if(!tokens.refresh_token)throw Error('A Google nao devolveu autorizacao persistente.');await put('GMAIL_CLIENT_ID',config.client_id);await put('GMAIL_CLIENT_SECRET',config.client_secret);await put('GMAIL_REFRESH_TOKEN',tokens.refresh_token);console.log('Autorizacao Gmail guardada na Cloudflare. Envio ainda DESATIVADO: falta testar e configurar a fila.');}catch{console.error('Nao foi possivel concluir a autorizacao. Nao partilhes credenciais; comunica apenas esta mensagem.');process.exitCode=1}finally{clearTimeout(timer);server.close();}

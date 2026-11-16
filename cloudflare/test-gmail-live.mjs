const base='https://furna-reservas.badduckstudio.workers.dev';
const headers={'Content-Type':'application/json',Origin:'https://noooanyway.github.io'};
const login=await fetch(base+'/admin/login',{method:'POST',headers,body:JSON.stringify({password:process.env.FURNA_TEST_TOKEN,code:process.env.FURNA_TEST_CODE})});
if(!login.ok){console.error('Falha na autenticação.');process.exit(1)}
const {session}=await login.json();
const result=await fetch(base+'/admin/email-test',{method:'POST',headers:{...headers,Authorization:`Bearer ${session}`}});
if(!result.ok){console.error('Falha no envio de teste Gmail.');process.exit(1)}
console.log('PASS: Gmail aceitou o envio de teste. Confirma a receção em furna.restaurante00@gmail.com (incluindo Spam).');

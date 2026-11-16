// Gmail API transport. OAuth credentials belong in Worker secrets, never frontend code.
const base64=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s)));
export async function sendNotification(env,event,reservation,fetcher=fetch){
 if(env.EMAIL_PROVIDER!=='gmail'||!env.GMAIL_CLIENT_ID||!env.GMAIL_CLIENT_SECRET||!env.GMAIL_REFRESH_TOKEN||!env.RESTAURANT_EMAIL)throw Error('Gmail não configurado');
 const owner=event==='pending',recipient=owner?env.RESTAURANT_EMAIL:reservation.email;
 if(!recipient)return {skipped:true};
 if(!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(recipient)||!/^furna\.restaurante00@gmail\.com$/.test(env.RESTAURANT_EMAIL))throw Error('Endereço inválido');
 const labels={pending:'Novo pedido de reserva',approved:'Reserva confirmada',rejected:'Pedido recusado',cancelled:'Reserva cancelada',changed:'Reserva atualizada'};
 if(!labels[event])throw Error('Evento inválido');
 const text=owner?`Há um novo pedido na Furna. Consulta o painel de gestão:\nhttps://noooanyway.github.io/Restaurante-Rex/gestao/\nReferência: ${reservation.id}`:`${labels[event]} — Furna\nData: ${reservation.date}\nHora: ${reservation.time}\nPessoas: ${reservation.people}\nReferência: ${reservation.id}\nContactos: 925 204 024 ou responda a este email.`;
 const tokenResponse=await fetcher('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GMAIL_CLIENT_ID,client_secret:env.GMAIL_CLIENT_SECRET,refresh_token:env.GMAIL_REFRESH_TOKEN,grant_type:'refresh_token'})});
 if(!tokenResponse.ok)throw Error('Falha na autorização Gmail');const token=await tokenResponse.json();if(!token.access_token)throw Error('Autorização inválida');
 const mime=[`From: Furna <${env.RESTAURANT_EMAIL}>`,`To: ${recipient}`,`Reply-To: ${env.RESTAURANT_EMAIL}`,`Subject: =?UTF-8?B?${base64('Furna — '+labels[event])}?=`,'MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',base64(text).match(/.{1,76}/g).join('\r\n')].join('\r\n');
 const response=await fetcher('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({raw:base64(mime).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')})});
 if(!response.ok)throw Error(`Gmail HTTP ${response.status}`);return {skipped:false};
}

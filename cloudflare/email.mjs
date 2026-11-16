// Send only explicitly configured, verified-domain messages; never log personal data.
export async function sendNotification(env, event, reservation, fetcher=fetch){
 if(!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.RESTAURANT_EMAIL)throw new Error('Email not configured');
 const owner=event==='pending';const recipient=owner?env.RESTAURANT_EMAIL:reservation.email;
 if(!recipient)return {skipped:true};
 const labels={pending:'Novo pedido de reserva',approved:'Reserva confirmada',rejected:'Pedido de reserva recusado',cancelled:'Reserva cancelada',changed:'Alteração de reserva'};
 const text=owner?`Há um novo pedido de reserva. Consulta o painel de gestão. Referência: ${reservation.id}`:`${labels[event]} — Furna.\nData: ${reservation.date}\nHora: ${reservation.time}\nPessoas: ${reservation.people}\nReferência: ${reservation.id}\nPara esclarecimentos, contacte o restaurante pelo telefone 925 204 024.`;
 const response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`furna-${event}-${reservation.notificationId}`},body:JSON.stringify({from:env.EMAIL_FROM,to:[recipient],reply_to:env.RESTAURANT_EMAIL,subject:`Furna — ${labels[event]}`,text})});
 if(!response.ok)throw new Error(`Email provider HTTP ${response.status}`);
 return {skipped:false};
}

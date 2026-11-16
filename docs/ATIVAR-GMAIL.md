# Ativar Gmail — preparação, não ativo

O transporte Gmail está implementado e testado com respostas simuladas. Não existe cron ativo nem autorização Google configurada. Não ativar só adicionando um cron: a fila contém eventos antigos e o processador atual lê o estado mais recente da reserva, pelo que precisa de revisão para snapshots, eventos ultrapassados, limites de tentativas e estados ambíguos de envio. Gmail não fornece a mesma chave de idempotência do transporte Resend anterior: uma resposta perdida pode causar duplicação se for reenviada cegamente.

## Passo do dono agora

1. Entrar em https://console.cloud.google.com/ com furna.restaurante00@gmail.com.
2. Criar um projeto chamado Furna Reservas (não é preciso comprar domínio para enviar com o Gmail).
3. Em APIs e serviços > Biblioteca, procurar Gmail API e ativar.
4. Abrir Google Auth Platform e configurar nome da aplicação, email de suporte e contacto do programador.
5. Para a fase inicial escolher público externo em teste e adicionar furna.restaurante00@gmail.com como utilizador de teste.
6. Avisar quando chegar a esta etapa. Não enviar passwords, códigos OAuth ou segredos pela conversa.

O passo seguinte é criar credenciais OAuth, autorizar apenas gmail.send e guardar GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET e GMAIL_REFRESH_TOKEN como segredos Cloudflare. O método de autorização e callback devem ser preparados antes de criar o cliente. O consentimento em teste pode causar expiração curta do refresh token; rever publicação e regras de verificação Google antes de operação contínua.

## Trabalho técnico antes de ativar

- Fluxo privado de autorização e renovação, sem expor tokens nos logs ou no Git.
- Confirmar conta remetente autorizada.
- Tratar eventos antigos e cancelados sem enviar avisos atrasados; preservar informação relevante de auditoria.
- Separar aviso ao dono e recibo ao cliente; o transporte atual envia pending apenas ao dono.
- Guardar dados do evento no momento da decisão, gerir falhas e evitar repetição cega em caso de entrega incerta.
- Testar com destinatários controlados e verificar entrada/spam, respostas e falhas reais.
- Ativar cron e acompanhar falhas. Configurar EMAIL_PROVIDER=gmail e RESTAURANT_EMAIL=furna.restaurante00@gmail.com apenas na ativação coordenada.

O Gmail permitirá respostas na mesma caixa. Clientes sem email continuam a ser contactados por telefone. Não equivale a serviço de entrega garantida. A cópia remota e alertas independentes continuam por implementar.

## Atualização 16/11/2026 — fila Gmail ativa

O teste real de envio foi recebido pelo dono. Foi criada gmail_outbox (migração 006), sem copiar eventos da fila antiga. Triggers antigos deixaram de criar entradas. A fila nova guarda os dados do evento e separa o aviso ao restaurante (pending) do recibo ao cliente (receipt). Clientes sem email não geram emails. Aprovação, recusa, cancelamento e mudança de data/hora/total geram eventos. Inserções telefónicas confirmadas não geram automaticamente confirmação; contactar manualmente.

Cron Cloudflare a cada minuto, máximo de oito mensagens por execução. Eventos de cliente em espera ultrapassados por decisões mais recentes são suprimidos. Erros anteriores ao envio e respostas explícitas de rejeição são repetidos até cinco tentativas, com dez minutos de intervalo. Falhas de rede no envio, erros 5xx ou interrupção após entrega ficam incertos e exigem consulta manual do Gmail; não há botão automático de reenviar essas mensagens. Sent significa aceite pelo Gmail, não comprovadamente entregue nem lido. Os detalhes de falha aparecem no painel após a publicação da interface.

Rever Google Auth Platform > Público-alvo: em modo Testing, refresh tokens com gmail.send podem expirar após sete dias. A passagem para produção e eventual verificação Google devem ser avaliadas antes de depender continuamente deste serviço. Não substituir o acompanhamento manual até concluir esse passo.

Uma mensagem de teste isolada foi colocada na nova fila para verificar a execução agendada. Não envolve clientes. Cópias remotas e alertas independentes de falha ainda não estão implementados.

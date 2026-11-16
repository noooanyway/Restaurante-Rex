# Emails automáticos da Furna

## Atualização 16/11/2026 — fila Gmail ativa

O teste real de envio foi recebido pelo dono. Foi criada gmail_outbox (migração 006), sem copiar eventos da fila antiga. Triggers antigos deixaram de criar entradas. A fila nova guarda os dados do evento e separa o aviso ao restaurante (pending) do recibo ao cliente (receipt). Reservas antigas sem email não geram emails. Novas reservas exigem email e telemóvel, incluindo as introduzidas no painel. Aprovação, recusa, cancelamento e mudança de data/hora/total geram eventos. Inserções telefónicas confirmadas não geram automaticamente confirmação; contactar manualmente.

Cron Cloudflare a cada minuto, máximo de oito mensagens por execução. Eventos de cliente em espera ultrapassados por decisões mais recentes são suprimidos. Erros anteriores ao envio e respostas explícitas de rejeição são repetidos até cinco tentativas, com dez minutos de intervalo. Falhas de rede no envio, erros 5xx ou interrupção após entrega ficam incertos e exigem consulta manual do Gmail; não há botão automático de reenviar essas mensagens. Sent significa aceite pelo Gmail, não comprovadamente entregue nem lido. Os detalhes de falha aparecem no painel após a publicação da interface.

Rever Google Auth Platform > Público-alvo: em modo Testing, refresh tokens com gmail.send podem expirar após sete dias. A passagem para produção e eventual verificação Google devem ser avaliadas antes de depender continuamente deste serviço. Não substituir o acompanhamento manual até concluir esse passo.

Uma mensagem de teste isolada foi colocada na nova fila para verificar a execução agendada. Não envolve clientes. Cópias remotas e alertas independentes de falha ainda não estão implementados.

## Contactos obrigatórios e utilização

Email e telemóvel são obrigatórios no formulário público, na criação manual e na edição de contactos. O servidor também valida estes campos. A validação de formato não comprova que o contacto pertence ao cliente.

Ao aprovar, recusar ou cancelar uma reserva com email, o servidor cria uma mensagem automática na fila. Aguardar normalmente um a dois minutos e confirmar a receção, incluindo Spam. O pedido inicial continua pendente até ser aprovado.

O botão «Pedir esclarecimento no Gmail» abre uma mensagem dirigida ao cliente; o dono escreve e envia através da conta Furna e regista o contacto no painel. Este botão não envia sozinho nem altera o estado da reserva.

O teste online cria reservas fictícias com o email da própria Furna, para nunca enviar mensagens a clientes reais. As alterações e cancelamentos desse teste podem originar emails identificados como TESTE.

### Próximos passos
1. Publicar a interface pelo GitHub Desktop (Push origin).
2. Criar um pedido TESTE com um email controlado pelo dono, aprovar no painel e verificar o email. Cancelar no fim.
3. Resolver o bloqueio de publicação da aplicação na Google Auth Platform. Enquanto estiver em teste, a autorização pode expirar ao fim de sete dias; se expirar, executar novamente `node cloudflare/setup-gmail.mjs` no computador autorizado. Isto é uma solução temporária.
4. Implementar cópia remota privada independente do computador, retenção, recuperação testada e alertas independentes de falha. Estes pontos ainda não estão concluídos.

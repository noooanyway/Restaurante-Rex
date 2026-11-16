# Serviço de reservas Furna

Requer Node.js 24. Executar `node server/index.mjs`. Usa SQLite persistente: guardar o ficheiro fora de pastas temporárias e configurar cópias de segurança.

Variáveis do serviço:
- BOOKING_DB: caminho da base SQLite.
- ADMIN_TOKEN: segredo forte, apenas no servidor e no acesso do responsável. Nunca incluir no frontend ou no Git.
- ALLOWED_ORIGINS: origens autorizadas, separadas por vírgulas; incluir https://noooanyway.github.io para produção.
- HOST e PORT: interface e porta do serviço. Usar HTTPS por proxy na publicação.

Frontend: definir NEXT_PUBLIC_BOOKING_API com o endereço HTTPS do serviço antes de `npm run build`. Sem essa configuração, o site informa que as reservas online estão indisponíveis; nunca apresenta disponibilidade fictícia.

GET /availability?date=AAAA-MM-DD devolve horários e mesas livres. POST /bookings cria pedidos pendentes; pending e approved ocupam mesas durante 60 minutos. A transação impede que pedidos simultâneos ocupem as mesmas mesas. Pedidos recusados/cancelados libertam capacidade. O restaurante deve tratar pendentes regularmente.

Gestão autenticada: cabeçalho Authorization: Bearer ADMIN_TOKEN.
- GET /admin: pedidos e mesas.
- PATCH /admin/bookings: {"id":"…","status":"approved"}, "rejected" ou "cancelled".
- POST /admin/tables: {"seats":4}, acrescenta uma mesa interior.

A aprovação não envia SMS/email: o responsável deve contactar o cliente pelo telefone fornecido. Não expor a base de dados. Antes de disponibilizar publicamente, configurar HTTPS, limitação de pedidos no proxy, política de retenção dos dados e autenticação do responsável. GitHub Pages não executa este serviço: é necessário um alojamento Node com disco persistente.

## Painel de gestão (versão de teste)

A página `/gestao/` permite consultar pedidos, aprovar, recusar, cancelar e adicionar mesas. Usa a mesma chave ADMIN_TOKEN definida no servidor; a chave só permanece na memória da página. O painel ainda não oferece autenticação individual, edição de reservas, inserção por telefone, bloqueios de horário ou grelha operacional de ocupação.

Não existe notificação automática por email ou SMS. Antes de usar com clientes reais, implementar autenticação apropriada, proteção contra tentativas de acesso, limitação de pedidos, HTTPS, backups e política de retenção; configurar um fornecedor de email e testar a entrega. Não ativar reservas públicas até estas etapas estarem concluídas.

## Proteção e cópias — estado atual

O servidor Node inclui limites locais básicos por endereço de ligação (30 acessos de gestão e 20 pedidos em 15 minutos), apenas em memória e por processo. Atrás de proxy pode agrupar utilizadores e não constitui proteção completa; configurar proteção por IP e limitação na infraestrutura antes da publicação. Não confiar em cabeçalhos de IP enviados pelo cliente.

`server/backup.mjs` cria uma cópia online consistente do SQLite e verifica a integridade. Definir BOOKING_DB e BACKUP_DIR em local privado, executar com Node 24 e automatizar no alojamento. Cópias no mesmo disco não protegem contra perda desse disco: transportar para armazenamento privado separado, definir retenção e testar restauro. Ainda não existe agendamento nem armazenamento remoto configurados. O teste `node server/test-backup.mjs` verifica uma cópia local com dados de teste.

O painel publicado continua sem servidor: NEXT_PUBLIC_BOOKING_API tem de apontar para um serviço HTTPS real e o servidor precisa de ADMIN_TOKEN forte definido como segredo. Não existe chave pré-definida. Não usar a chave de teste para produção. A chave partilhada atual não substitui autenticação individual, sessões seguras e proteção de acesso; não publicar dados de clientes antes de concluir essas etapas.

A adaptação planeada para Cloudflare D1 exige implementação e política de backups próprias: este script e estes limites são apenas para o servidor Node/SQLite atual e não configuram Cloudflare.

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

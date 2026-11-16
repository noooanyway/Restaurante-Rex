# Cloudflare — estado da configuração

Base D1 furna-reservas criada em WEUR e esquema inicializado com 12 mesas, sem reservas reais. D1 Time Travel está ativo automaticamente; no plano gratuito permite recuperação até sete dias. Isso não substitui exportações independentes e testes de restauro.

`worker.mjs` é um protótipo de gestão. Não está publicado, não tem ADMIN_TOKEN definido e não está ligado ao site. Suporta consulta de disponibilidade autenticada, aprovação, recusa, cancelamento e adição de mesas; ainda não aceita pedidos públicos nem implementa edição, registo telefónico ou envio de email. Não o usar com dados reais.

O limite de tentativas é aproximado e aplicado por localização Cloudflare; não substitui Cloudflare Access, proteção na borda, autenticação individual e observabilidade. Antes de ativar, implementar operações completas com controlo de concorrência, autenticação robusta e testes ponta a ponta. Nunca guardar chaves no Git ou no frontend.

Executar testes: `node cloudflare/test.mjs`; simular publicação: `npx wrangler deploy --dry-run`. Esquema: `schema.sql`. Configuração: `wrangler.jsonc`.


Teste local isolado: inicializar uma pasta nova com `wrangler d1 execute furna-reservas --local --persist-to .wrangler/teste --file cloudflare/schema.sql` e depois `--file cloudflare/test-fixtures.sql`; iniciar `wrangler dev --local --persist-to .wrangler/teste --port 8788 --var ADMIN_TOKEN:teste-local-furna`, e executar `node cloudflare/test-integration.mjs`. Usar uma pasta nova para cada execução. Nunca usar estas instruções com --remote. A chave é exclusivamente de teste.

## Atualização do protótipo Cloudflare

Gestão local: consulta, aprovação, recusa, cancelamento, adição de mesas, registo telefónico e alteração de data/hora/total de pessoas. As alterações e inserções alocam mesas por instrução SQL única; testes locais cobrem conflito e concorrência. A alteração não edita contactos, número de crianças/bebés ou observações.

Ainda não pronto para produção: pedidos públicos, email opcional, notificações e acompanhamento de falhas, autenticação individual com sessão segura, proteções completas, backups independentes e teste remoto faltam. A chave partilhada com limitação aproximada é apenas protótipo; não usar para dados reais. O serviço Cloudflare não está publicado nem ligado ao site.
## Estado do desenvolvimento posterior

O Worker local implementa disponibilidade pública e criação atómica de pedidos pendentes, com expiração após 3600 segundos e email opcional. Não está publicado. `migration-002.sql` apenas foi executada em base de teste local; NÃO foi aplicada à base remota. Nunca aplicar a migração sem verificar cópia e dados existentes. O formulário público exige explicitamente NEXT_PUBLIC_ENABLE_BOOKINGS=true, além do endereço API; não ativar antes de segurança, notificações e testes finais.

O Gmail confirmado pelo utilizador é furna.restaurante00@gmail.com. Não foi configurado fornecedor de email nem existem notificações implementadas. Pendentes expirados não enviam aviso automático; o painel assinala-os como expirados e não permite aprovação após expiração. O restaurante terá de contactar o cliente para combinar novo pedido.

Antes de produção faltam: autenticação individual segura, revisão de abuso com proteção além de limites aproximados, migração remota segura, backups independentes e teste de restauro, envio robusto de emails com registo/repetição e configuração do remetente, edição completa, testes remotos ponta a ponta e monitorização. Não publicar com dados reais antes desses passos.

## Preparação de notificações e proteção — ainda não ativa

Migrações 002 e 003 e outbox de notificações foram testadas apenas localmente. Nenhuma migração foi aplicada à base remota. O Worker não está publicado. O envio requer RESEND_API_KEY como segredo, EMAIL_FROM num domínio verificado e RESTAURANT_EMAIL=furna.restaurante00@gmail.com. Nunca guardar a chave no repositório. A fila tenta novamente após falhas e apresenta falhas no painel; ainda necessita de teste de ponta a ponta, confirmação de entrega e revisão das mensagens antes de usar dados reais.

Cloudflare Access requer configuração Zero Trust e política de acesso; a chave atual continua a ser um protótipo. Para backups independentes, `cloudflare/backup.ps1` exporta manualmente para uma pasta privada fora do repositório; ainda não existe backup remoto automático nem teste de restauro remoto. D1 Time Travel no plano gratuito tem até sete dias. A exportação contém dados pessoais e deve ser protegida.

## Estado atual — serviço de gestão em teste online

O Worker `furna-reservas` está publicado em workers.dev e ligado à D1. O segredo ADMIN_TOKEN foi configurado pelo dono na Cloudflare. GET /admin sem chave devolveu 401; as reservas públicas estão desativadas no servidor e no frontend. A página de gestão aponta para o serviço, mas o acesso autenticado do utilizador e ações ainda precisam de verificação online. O token partilhado e o limitador aproximado não substituem Cloudflare Access/autenticação individual e proteção adicional; não usar dados reais até concluir essas etapas. O Time Travel D1 não é uma cópia independente. A exportação manual existe, mas backups automáticos externos e restauro ainda não foram configurados.

Envio automático de emails adiado por escolha do utilizador. Cron desativado. Decisões devem ser comunicadas manualmente por telefone ou Gmail. Não configurar RESEND_API_KEY até o utilizador decidir ativar.

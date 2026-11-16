# Cloudflare — estado da configuração

Base D1 furna-reservas criada em WEUR e esquema inicializado com 12 mesas, sem reservas reais. D1 Time Travel está ativo automaticamente; no plano gratuito permite recuperação até sete dias. Isso não substitui exportações independentes e testes de restauro.

`worker.mjs` é um protótipo de gestão. Não está publicado, não tem ADMIN_TOKEN definido e não está ligado ao site. Suporta consulta de disponibilidade autenticada, aprovação, recusa, cancelamento e adição de mesas; ainda não aceita pedidos públicos nem implementa edição, registo telefónico ou envio de email. Não o usar com dados reais.

O limite de tentativas é aproximado e aplicado por localização Cloudflare; não substitui Cloudflare Access, proteção na borda, autenticação individual e observabilidade. Antes de ativar, implementar operações completas com controlo de concorrência, autenticação robusta e testes ponta a ponta. Nunca guardar chaves no Git ou no frontend.

Executar testes: `node cloudflare/test.mjs`; simular publicação: `npx wrangler deploy --dry-run`. Esquema: `schema.sql`. Configuração: `wrangler.jsonc`.


Teste local isolado: inicializar uma pasta nova com `wrangler d1 execute furna-reservas --local --persist-to .wrangler/teste --file cloudflare/schema.sql` e depois `--file cloudflare/test-fixtures.sql`; iniciar `wrangler dev --local --persist-to .wrangler/teste --port 8788 --var ADMIN_TOKEN:teste-local-furna`, e executar `node cloudflare/test-integration.mjs`. Usar uma pasta nova para cada execução. Nunca usar estas instruções com --remote. A chave é exclusivamente de teste.

## Atualização do protótipo Cloudflare

Gestão local: consulta, aprovação, recusa, cancelamento, adição de mesas, registo telefónico e alteração de data/hora/total de pessoas. As alterações e inserções alocam mesas por instrução SQL única; testes locais cobrem conflito e concorrência. A alteração não edita contactos, número de crianças/bebés ou observações.

Ainda não pronto para produção: pedidos públicos, email opcional, notificações e acompanhamento de falhas, autenticação individual com sessão segura, proteções completas, backups independentes e teste remoto faltam. A chave partilhada com limitação aproximada é apenas protótipo; não usar para dados reais. O serviço Cloudflare não está publicado nem ligado ao site.

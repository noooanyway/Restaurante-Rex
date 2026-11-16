# Cloudflare — estado da configuração

Base D1 furna-reservas criada em WEUR e esquema inicializado com 12 mesas, sem reservas reais. D1 Time Travel está ativo automaticamente; no plano gratuito permite recuperação até sete dias. Isso não substitui exportações independentes e testes de restauro.

`worker.mjs` é um protótipo só de leitura. Não está publicado, não tem ADMIN_TOKEN definido e não está ligado ao site. Não aceita pedidos públicos nem implementa aprovação, recusa, cancelamento, criação de mesa, edição, registo telefónico ou envio de email. Não o usar com dados reais.

O limite de tentativas é aproximado e aplicado por localização Cloudflare; não substitui Cloudflare Access, proteção na borda, autenticação individual e observabilidade. Antes de ativar, implementar operações completas com controlo de concorrência, autenticação robusta e testes ponta a ponta. Nunca guardar chaves no Git ou no frontend.

Executar testes: `node cloudflare/test.mjs`; simular publicação: `npx wrangler deploy --dry-run`. Esquema: `schema.sql`. Configuração: `wrangler.jsonc`.

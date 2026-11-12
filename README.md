# REX — Matéria em transformação

Website em português de Portugal, Next.js App Router, React, TypeScript e Tailwind CSS. Exportação estática, sem base de dados nem dependência de serviço de reservas.

## Executar

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000. Para produção: `npm run build`; publicar a pasta `out`. Verificação de tipos: `npm run typecheck`.

## Conteúdo

- `src/data/restaurant.ts`: nome, morada, horários, telefone, email, URL de reservas, ementa e fotografias.
- Campos não confirmados são `null`. A ligação de reservas só aparece quando existir uma URL real. Não há formulários nem confirmações simuladas.
- Só 5 € e 4 € são preços confirmados. A nota do asterisco de Peixe do dia aguarda informação e não foi inventada.
- Fotografias locais em `public/images`; proveniência em `PHOTO-CREDITS.md`. Substituir também descrições alternativas e créditos quando forem trocadas.
- `src/app/globals.css`: direção visual, composição e adaptações responsivas.
- `src/app/layout.tsx`: metadados. A versão provisória tem `noindex`; rever para a publicação oficial após confirmar nome e dados do restaurante.

## Direção artística

Um caderno de matéria: azul-cobalto e papel, letras de grande escala, imagens em folhas inclinadas e uma roseta desenhada em SVG como assinatura de transformação. Fotografia de ingredientes, sem sugerir um espaço ou pratos do REX que ainda não foram fotografados. Alternativas exploradas: linguagem botânica suave e ambiente cinematográfico escuro. A direção editorial escolhida distancia-se da referência PRADO.

## Acessibilidade e manutenção

HTML semântico, ligação para saltar conteúdo, foco visível, filtros com estado `aria-pressed`, anúncio da categoria selecionada, respeito por movimento reduzido e imagens com texto alternativo. A ementa completa está presente na renderização inicial. Sem bibliotecas de animação, rastreadores ou fontes externas.

# Segunda iteração — crítica e decisões

## Diagnóstico da primeira versão

A primeira versão tinha consistência cromática, mas confundia muitas vezes identidade com sinais reconhecíveis de design editorial.

1. O logótipo gigante, a fotografia inclinada, o selo circular, a roseta e a seta formavam um conjunto de recursos muito usado em templates de estúdios e restaurantes. Competiam entre si sem aprofundar o conceito.
2. Os títulos em sans-serif com uma palavra em itálico repetiam uma fórmula previsível. A expressividade vinha da escala e dos adereços, não do conteúdo.
3. Frases como «A natureza dá. A curiosidade transforma.» eram suficientemente vagas para servir muitos restaurantes. A ementa fornecida oferecia material mais próprio e interessante.
4. A sequência de manifesto, fotografia, ementa e contactos tinha um ritmo demasiado uniforme. A ementa demorava a ganhar protagonismo e o índice desaparecia durante a leitura.
5. O recorte horizontal da primeira fotografia eliminava parte da composição original. A inclinação e o selo dificultavam a apreciação do estudo de ingredientes.
6. O mobile reduzia e empilhava a composição de desktop. Alguns textos auxiliares eram demasiado pequenos para o seu papel.

## Decisões implementadas

- Reconstrução da abertura como uma dupla página: tipografia serifada compacta e fotografia frontal, com acesso direto à ementa.
- Amarelo ácido, beringela e papel. O contraste relaciona acidez e densidade, duas qualidades presentes nas combinações da carta.
- Remoção dos selos, rosetas, inclinações e itálicos decorativos.
- Narrativa visual baseada numa combinação real: morcela × laranja fermentada × chocolate negro. O título deriva dos dados da ementa.
- Ementa como catálogo: índice lateral persistente em desktop, filtros visíveis com alvos de pelo menos 44 px em mobile, pratos e preços com hierarquia clara.
- Reorganização da secção de visita e substituição dos textos genéricos por conteúdo ligado ao produto e às técnicas fornecidas.
- Sem novas bibliotecas, efeitos de cursor, animações de scroll ou dependências externas.

## Verificação

Comparação visual da versão anterior e da nova em desktop (1440 px) e mobile (390 px). Verificação adicional a 320 px e 768 px. Corrigido um transbordo do logótipo detetado na primeira revisão móvel.

Todos os filtros verificados: Couvert 2, Entradas 5, Vegetarianos 2, Peixe 3, Carnes 4, Sobremesas 3, Tudo 19. Confirmados apenas dois preços: 5 € e 4 €. Interação por teclado verificada e consola sem erros durante os testes. Não foi realizada uma auditoria completa com leitor de ecrã.

## Limites que permanecem

A fotografia continua provisória e ainda não representa a cozinha do REX. A identidade definitiva deve ser reavaliada com imagens próprias, o espaço real e o nome confirmado. A paleta e a tipografia são uma direção artística proposta, não substituem esse trabalho de identidade. Morada, horários, contactos e reservas continuam pendentes e configuráveis.

A primeira versão permanece no histórico Git, no commit 68c73e4849e6e7b70b5380b994fa1ad43bdd10e6.

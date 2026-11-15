# Furna — plano para completar o site

Estado revisto em 15/11/2026. Este documento é um plano de trabalho; itens por fazer não são funcionalidades disponíveis. Não cria lembretes automáticos.

## Já implementado

- Identidade Furna — Restaurante e Esplanada, quatro paletas selecionáveis, navegação Ementa / Reservas / Galeria / Contactos.
- Ementa fornecida, contacto telefónico, morada e horários comunicados.
- Formulário com adultos, crianças, bebés, cadeira de bebé e observações.
- Serviço Node/SQLite com pedidos pendentes, disponibilidade por horário, ocupação de 60 minutos, aprovação/recusa/cancelamento via API protegida e adição de mesas.
- Grelha de disponibilidade; sem servidor ligado apresenta estados por consultar.
- Publicação estática no GitHub Pages. O serviço de reservas ainda não está alojado nem ligado à publicação pública.

## P0 — necessários antes de aceitar reservas online

### Backend e alojamento
- [ ] Alojamento Node compatível com SQLite e disco persistente, HTTPS, domínio/endereço do serviço e origem autorizada do frontend.
- [ ] Configurar NEXT_PUBLIC_BOOKING_API no processo de build; separar ambientes de desenvolvimento, testes e produção.
- [ ] Centralizar horários, duração, lotação e mesas: atualmente existem valores duplicados entre configuração, frontend e servidor.
- [ ] Confirmar disposição e capacidade de cada mesa; quatro lugares por mesa é apenas a distribuição inicial dos 48 lugares.
- [ ] Definir junção de mesas para grupos, limites de pessoas e tratamento de cadeiras/carrinhos de bebé.
- [ ] Definir prazo dos pedidos pendentes e libertação automática ou manual das mesas. Atualmente os pendentes bloqueiam capacidade até serem tratados.
- [ ] Validar alterações, cancelamentos, feriados, encerramentos excecionais e última entrada de cada serviço.
- [ ] Revalidar disponibilidade no envio e nas alterações/aprovações; testar concorrência, idempotência, tentativas repetidas e recuperação após falha.
- [ ] Limitar pedidos abusivos e tamanho dos dados; adicionar logs sem conteúdo sensível, monitorização e alertas técnicos.
- [ ] Cópias de segurança automáticas e teste de restauro da base de dados.

### Painel de gestão utilizável — ainda não existe
- [ ] Autenticação individual dos responsáveis, recuperação de acesso, sessões seguras e permissões.
- [ ] Agenda por dia/serviço, lista de pedidos pendentes e pesquisa por nome/referência.
- [ ] Aprovar, recusar, cancelar e alterar reservas, com confirmação das ações e histórico.
- [ ] Ver adultos/crianças/bebés, necessidades de cadeira e observações alimentares com acesso restrito.
- [ ] Atribuir/juntar mesas e acrescentar ou desativar mesas extra sem invalidar reservas existentes.
- [ ] Grelha visual operacional com disponibilidade por intervalo. Uma planta da sala só depois de obter a disposição real.
- [ ] Bloquear horários para grupos, eventos ou encerramentos e inserir reservas recebidas por telefone.
- [ ] Interface utilizável em telemóvel/tablet, com mensagens de erro e confirmação compreensíveis.

### Comunicação ao cliente
- [ ] Escolher canal de confirmação: telefone manual, email ou SMS. Atualmente não existe envio automático.
- [ ] Distinguir claramente pedido recebido, aprovado, recusado e cancelado.
- [ ] Se houver email/SMS: fornecedor, remetente, credenciais seguras, tentativas de reenvio e registo de entrega.
- [ ] Definir política de cancelamento, atrasos e faltas; apresentar ao cliente antes de enviar.
- [ ] Definir aviso de privacidade, finalidade, retenção e eliminação de dados. Observações sobre alergias podem conter dados de saúde: minimizar recolha e restringir acesso.

## P1 — frontend e conteúdos finais
- [ ] Simplificar o percurso público: data, adultos/crianças/bebés, horários compatíveis, contactos e observações opcionais.
- [ ] Avaliar retirar a grelha pública e reservá-la ao painel de gestão; o cliente não escolhe atualmente uma mesa específica.
- [ ] Garantir mensagens para lotação esgotada, falha do servidor e mudança de disponibilidade enquanto se preenche o formulário.
- [ ] Fotografias próprias da sala, esplanada e pratos, com autorização de utilização, alternativas textuais e otimização.
- [ ] Galeria real com ampliação acessível por teclado, fecho claro e gestão de foco.
- [ ] Confirmar preços em falta e nota original associada ao peixe do dia; não inventar informação.
- [ ] Confirmar links das redes sociais, email se aplicável e localização num serviço de mapas.
- [ ] Escolher paleta definitiva e decidir se o seletor fica público ou apenas na gestão.
- [ ] Rever identidade, textos, ícones e metadados antigos do REX; domínio e endereço definitivo da Furna.
- [ ] Rever SEO, imagem de partilha e indexação (a versão provisória tem noindex); dados estruturados apenas com informações confirmadas.

## P2 — qualidade e operação
- [ ] Testes completos de teclado/leitor de ecrã, contraste nas quatro paletas, zoom a 200% e ecrãs estreitos.
- [ ] Testes de iOS/Android e browsers principais; validar estados de carregamento, erro e sucesso.
- [ ] Medir desempenho com fotografias finais e corrigir carregamento e deslocamentos de layout.
- [ ] Documentar configuração, publicação, rollback, restauro e operação diária para a equipa.
- [ ] Testar ponta a ponta uma reserva real: consulta, pedido, aprovação, contacto ao cliente, cancelamento e libertação de mesa.

## Critério para considerar o site completo

Uma pessoa consegue consultar informação atualizada e pedir uma reserva sem ambiguidade; a equipa consegue tratar o pedido num painel, contactar o cliente e gerir capacidade sem editar código; o sistema impede conflitos, protege os dados e pode ser recuperado de uma falha. Estes passos devem ser verificados no ambiente publicado, não apenas localmente.

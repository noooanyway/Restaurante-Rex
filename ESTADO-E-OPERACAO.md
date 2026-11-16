# Furna — estado e guia de operação

Revisto em 16/11/2026. Este documento substitui as indicações de estado antigas do ROADMAP.md. Não é uma certificação de segurança ou de conformidade legal.

## Conclusão

O serviço de reservas está ativo na Cloudflare. O restaurante pode trabalhar com pedidos sujeitos a aprovação e contacto manual, desde que alguém consulte regularmente o painel. O sistema ainda não está completamente finalizado: há limitações de pesquisa, recuperação, privacidade e ergonomia que devem ser acompanhadas. Não prometer avisos automáticos nem recuperação independente do computador.

A revisão atual verificou disponibilidade pública (18 horários para a data consultada), autenticação por testes locais e compilação. O utilizador já confirmou envio, aprovação e cancelamento pelo site. Não foi efetuada nesta revisão uma auditoria de segurança nem uma verificação visual completa em browsers e telemóveis.

## Serviços utilizados

- Site: GitHub Pages, https://noooanyway.github.io/Restaurante-Rex/
- Gestão: https://noooanyway.github.io/Restaurante-Rex/gestao/
- Nova página de reservas, após publicação: https://noooanyway.github.io/Restaurante-Rex/reservas/
- API e base de dados: Cloudflare Worker e D1.
- Contacto manual: furna.restaurante00@gmail.com e telefone 925 204 024.
- Gmail não está integrado como fornecedor de envio. O site não envia nem lê mensagens dessa conta.
- Não é necessário comprar domínio para o endereço técnico funcionar. Não existe garantia de custo zero ilimitado ou disponibilidade sem interrupções. Rever os limites dos planos e as regras do GitHub Pages antes de considerar definitivo este alojamento comercial.

## Primeiro passo: publicar alterações pendentes

1. No GitHub Desktop selecionar furna-github e clicar Push origin.
2. No GitHub abrir Actions e aguardar o workflow de publicação terminar com sucesso.
3. Abrir o site com Ctrl+F5. A ligação Reservas deve abrir uma página própria.
4. Entrar na gestão e confirmar pesquisa, filtros, composição do grupo, bloqueio do dia e histórico/contacto.

Na revisão, a última publicação confirmada era 5a9a3e3. A página separada, filtros, histórico e correções posteriores tinham commits locais ainda por enviar. O servidor já recebeu as alterações de composição e histórico; não é preciso executar migrações manualmente.

## O que existe

- Disponibilidade em intervalos de 15 minutos; ocupação prevista de uma hora; segunda-feira encerrada; interior reservável.
- Pedidos pendentes até serem tratados, com atribuição de capacidade. Pendentes bloqueiam as mesas: não os deixar esquecidos.
- Aprovar, recusar, cancelar, alterar data/hora/grupo/contactos e registar por telefone.
- Atribuição de várias mesas com validação de capacidade e conflitos no servidor.
- Agenda por mesa e mapa; arrasto para posições vazias e seleção/junção de mesas de um grupo, com confirmação para guardar a atribuição.
- Disposição global da sala, partilhada por todas as datas, não uma planta física à escala.
- Bloqueios de períodos e dia inteiro, recusados se existirem reservas ativas sobrepostas.
- Histórico a partir da migração 005: alterações de estado, grupo, contactos e mesas. Não reconstrói ações anteriores nem guarda valores anteriores completos.
- Registo manual de quem contactou e por que meio. Não comprova envio nem identifica automaticamente o operador, porque a conta é partilhada.
- Chave e código da aplicação de autenticação; sessão de 15 minutos. Credenciais não devem ser partilhadas em conversas.

## Rotina diária com Gmail

1. Abrir a gestão e selecionar o dia do serviço. Verificar também pedidos para outras datas e pedidos pendentes.
2. Atualizar o painel regularmente; não há notificações nem atualização contínua garantida.
3. Verificar grupo, horário, lugares e observações antes de aprovar.
4. Contactar o cliente por telefone ou Gmail após a decisão. Pedido recebido não significa reserva confirmada.
5. Registar o contacto no histórico com nome do operador e meio utilizado.
6. Inserir reservas por telefone antes de comprometer capacidade com outros grupos.
7. Cancelar ou recusar pedidos sem seguimento, após contacto e segundo as regras da equipa.
8. No fim do serviço, rever pendentes e reservas futuras.

## Verificação pelo dono — computador e telemóvel

Usar apenas dados fictícios, nome TESTE, e cancelar os pedidos no fim.

1. Na página Reservas escolher uma data futura, grupo e hora. Enviar e verificar referência. Fazer uma tentativa com campos obrigatórios vazios: não deve enviar.
2. Na gestão localizar o pedido e comparar nome, pessoas e hora. Aprovar; confirmar agenda e mapa.
3. Alterar total, crianças e bebés. A soma de crianças e bebés deve ser inferior ao total (pelo menos um adulto). Recarregar e verificar persistência.
4. Pesquisar nome, telefone e referência. Combinar filtros de estado e almoço/jantar. Limpar filtros para regressar à lista.
5. Mover uma mesa para espaço vazio e recarregar. Num telemóvel usar setas caso o arrasto não seja suportado.
6. Juntar uma mesa livre a um grupo, guardar e recarregar. Retirar uma mesa deixando capacidade insuficiente: o servidor deve recusar.
7. Bloquear uma data sem reservas, confirmar ausência de horários nesse período e remover o bloqueio. Bloquear um período ocupado deve falhar.
8. Alterar uma reserva e abrir histórico. Registar contacto fictício e confirmar que aparece após recarregar.
9. Cancelar o pedido e verificar libertação de disponibilidade. Confirmar também recusa de outro pedido fictício.
10. No telemóvel verificar legibilidade, ausência de botões cortados e acesso às ações; o mapa pode exigir deslocação horizontal.

## Falta concluir — prioridades técnicas

- Pesquisa e paginação no servidor: a lista está limitada aos 500 pedidos mais recentes; filtros locais não pesquisam a base inteira. A agenda diária consulta os grupos do dia, mas detalhes de pedidos fora da lista podem não estar carregados.
- Eliminação/anonymização efetiva e retenção das cópias. Os 90 dias são apenas proposta; não há limpeza automática ativa.
- Finalizar aviso de privacidade com identidade do responsável, finalidade, fundamento, prestadores, direitos, contacto e prazo efetivo. Rever especialmente observações que contenham dados de saúde. Ver docs/privacidade-reservas-rascunho.md.
- Publicar regras de cancelamento/atraso apenas alinhadas com operação real. Não há deteção automática de faltas ou atrasos.
- Melhorar calendário de eventos/encerramentos de vários dias e configuração central de horários, duração e lotação. Há valores duplicados e limite de grupo de 48 pessoas mesmo que se adicionem mesas extra.
- Robustecer posicionamento contra duas alterações simultâneas e posições duplicadas. A validação de posição disponível ainda é feita na interface; a atribuição de reservas tem validação atómica no servidor.
- Evitar duplicação de pedidos quando a rede falha após o servidor gravar (idempotência). Contactar o restaurante antes de repetir um pedido cujo resultado seja incerto.
- Completar acessibilidade, arrasto por toque, estados de erro e verificação em tablet/telemóvel.
- Monitorização de falhas e consumo Cloudflare; procedimento de recuperação de autenticação e resposta a incidentes.
- Rever testes antigos que ainda pressupõem autenticação só por chave; os testes novos de dois fatores são os relevantes para o acesso atual.

## Adiado por decisão do dono

- Emails e avisos automáticos, fornecedor de envio e eventual domínio.
- Cópia remota independente do computador, alertas de falha e recuperação em novo equipamento.
- Contas individuais e substituição do sistema de autenticação atual.
- Fotografias finais, redes sociais, identidade detalhada, planta com portas e circulação e restantes conteúdos dependentes do restaurante.

## Cópias atuais e recuperação

A tarefa Windows FurnaBackup executa diariamente às 10h e guarda ficheiros .dpapi em Documents/Furna-Backups. Precisa do computador disponível, do perfil Windows e do acesso Wrangler à Cloudflare. Verificar no Agendador de Tarefas o último resultado e a data do ficheiro criado; existir uma tarefa não prova que as execuções futuras funcionarão.

A cifra depende do perfil Windows. Perder o computador/perfil pode tornar estas cópias inutilizáveis. Já foi ensaiada a desencriptação e importação numa base D1 local isolada. Não restaurar diretamente sobre produção sem plano, cópia prévia e validação. Não guardar SQL, chaves ou cópias no Git.

## Em caso de problema

- Se não aparecer um pedido, rever data, filtros, referência e atualizar o painel antes de o criar de novo.
- Se a sessão expirar, entrar novamente com chave e código atual.
- Se a disponibilidade falhar, usar o telefone; não assumir que a mesa está livre.
- Se for necessário interromper pedidos públicos, um responsável técnico deve publicar ENABLE_PUBLIC_BOOKINGS=false no Worker e confirmar HTTP 503 no endpoint público. O painel permanece separado dessa opção. Avisar a equipa para continuar por telefone.
- GitHub Pages publica o frontend; npx wrangler deploy publica o backend. Um Push origin, sozinho, não atualiza o Worker.

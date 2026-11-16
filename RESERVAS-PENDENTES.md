# Reservas — decisões e revisão futura

- Duração provisória: **60 minutos**, definida em 12/11/2026.
- Rever a duração após observar os tempos reais de serviço; considerar almoço, jantar e dimensão do grupo.
- A duração é configurável em `src/data/booking.ts`, no campo `durationMinutes`.
- Pedidos sujeitos a aprovação manual pelo restaurante.
- 12 mesas interiores, 48 lugares; distribuição inicial de quatro lugares por mesa editável.
- Esplanada excluída das reservas.
- Terça-feira a domingo: 12:00–15:00 e 19:00–22:00. Segunda-feira encerrado.

## Antes de ativar

Ligar armazenamento partilhado, disponibilidade por intervalo, aprovação/cancelamento e gestão autenticada de mesas. A disponibilidade deve impedir sobreposição de reservas aprovadas e ser novamente verificada ao aprovar um pedido. A última entrada de cada serviço deve permitir os 60 minutos completos antes do fecho.

O formulário de preparação não envia nem guarda dados. Não apresentar contagens de mesas como reais antes de ligar o serviço.

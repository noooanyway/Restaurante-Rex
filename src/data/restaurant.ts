export const restaurant: { name: string; address: string | null; hours: string | null; phone: string | null; email: string | null; bookingUrl: string | null } = {
  name: 'Furna', address: 'Ladeira de Santo António, 9940-207 Santo António', hours: 'Terça-feira a domingo: 12:00–15:00 e 19:00–22:00. Segunda-feira encerrado.', phone: '925 204 024', email: null, bookingUrl: null,
};
export const photos = {
  garden: { src: '/Restaurante-Rex/images/materia.webp', alt: 'Couve, espargos e batatas numa composição de ingredientes', author: 'Toa Heftiba', url: 'https://unsplash.com/photos/green-cabbage-and-brown-potato-T87aXDZD6RQ' },
  sea: { src: '/Restaurante-Rex/images/mar.webp', alt: 'Pormenor de sardinhas prateadas num mercado', author: 'Romeio Paul', url: 'https://unsplash.com/photos/a-pile-of-fish-7CDmNCJdcc8' },
};
export type Dish = { name: string; ingredients?: string; price?: string };
export const menu: { category: string; dishes: Dish[] }[] = [
 {category:'Couvert',dishes:[{name:'Coscorão',ingredients:'Queijo de São Jorge | Algas',price:'5 €'},{name:'Prato de queijo',price:'4 €'}]},
 {category:'Entradas',dishes:[{name:'Flatbread',ingredients:'Peixe curado | Abóbora | Aioli'},{name:'Hambúrguer de picanha',ingredients:'Maionese de alho fermentado'},{name:'Morcela',ingredients:'Laranja fermentada | Chocolate negro'},{name:'Tartelete de atum',ingredients:'Kimchi | Manteiga de amendoim'},{name:'Tataki de vaca',ingredients:'Limão tangerino | Miso'}]},
 {category:'Vegetarianos',dishes:[{name:'Gnocchi de abóbora',ingredients:'Cebola fermentada | Castanha'},{name:'Inhame',ingredients:'Couve assada | Cogumelos | Cebola'}]},
 {category:'Peixe',dishes:[{name:'Peixe do dia',ingredients:'Arroz do mar | Salada verde'},{name:'Lula dos Açores',ingredients:'Balchão | Milho tostado'},{name:'Peixe do dia',ingredients:'Couve-flor | Molho de sésamo e ervas'}]},
 {category:'Carnes',dishes:[{name:'Arroz de forno',ingredients:'Ossobuco | Salada verde'},{name:'Picanha',ingredients:'Preço por kg a definir'},{name:'T-bone',ingredients:'Preço por kg a definir'},{name:'Bochecha de porco',ingredients:'Abóbora | Cacau e sementes'}]},
 {category:'Sobremesas',dishes:[{name:'Paris-Brest',ingredients:'Creme de queijo de São Jorge e mel | Praliné de noz'},{name:'Bola de Berlim'},{name:'Mousse de chocolate'}]},
];
// Nota original do asterisco de Peixe do dia: aguarda confirmação; não publicar uma interpretação.

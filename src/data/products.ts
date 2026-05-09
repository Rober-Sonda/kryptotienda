export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  category: 'anime' | 'retro' | 'gym' | 'simpsons' | 'argentina';
  subcategory?: string;
  mockupBg?: 'black' | 'white';
}

export const productsData: Product[] = [
  // Anime
  { id: 1, title: 'Attack on Titan Elite', image: '/anime-aot.png', price: '$25.000', category: 'anime', subcategory: 'Shonen' },
  { id: 2, title: 'Demon Slayer Spirit', image: '/anime-demon.png', price: '$25.000', category: 'anime', subcategory: 'Shonen' },
  { id: 3, title: 'Naruto Shippuden', image: '/anime-naruto.png', price: '$25.000', category: 'anime', subcategory: 'Clásicos' },
  { id: 4, title: 'Jujutsu Kaisen', image: '/anime-jjk.png', price: '$25.000', category: 'anime', subcategory: 'Modernos' },
  
  // Retro
  { id: 5, title: 'Zelda Master Sword', image: '/retro-zelda.png', price: '$25.000', category: 'retro', subcategory: 'Aventura' },
  { id: 6, title: 'Mario 8-bit', image: '/retro-mario.png', price: '$25.000', category: 'retro', subcategory: 'Nostalgia' },
  { id: 7, title: 'Sonic Retro', image: '/retro-sonic.png', price: '$25.000', category: 'retro', subcategory: 'Nostalgia' },
  { id: 8, title: 'Pac-Man Arcade', image: '/retro-pacman.png', price: '$25.000', category: 'retro', subcategory: 'Arcade' },
  
  // Gym
  { id: 9, title: 'Broly Lift', image: '/nuevos_disenos/broly.png', price: '$25.000', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'white' },
  { id: 10, title: 'Saiyan Fitness', image: '/nuevos_disenos/goku-saiyan.png', price: '$25.000', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'black' },
  { id: 11, title: 'Train Insaiyan', image: '/nuevos_disenos/goku-train.png', price: '$25.000', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'black' },
  { id: 12, title: 'Galaxy Groot Gym', image: '/nuevos_disenos/groot.png', price: '$25.000', category: 'gym', subcategory: 'OTROS', mockupBg: 'black' },
  { id: 13, title: 'Sumo Gym Honda', image: '/nuevos_disenos/ehonda.png', price: '$25.000', category: 'gym', subcategory: 'OTROS', mockupBg: 'white' },
  
  { id: 14, title: 'Zoro Big or Home', image: '/gym-zoro-v2.jpg', price: '$25.000', category: 'gym', subcategory: 'Anime Fitness' },
  { id: 15, title: 'Luffy Beast Mode', image: '/gym-luffy-v2.jpg', price: '$25.000', category: 'gym', subcategory: 'Anime Fitness' },
  { id: 16, title: 'Gohan One More Rep', image: '/gym-gohan-v2.jpg', price: '$25.000', category: 'gym', subcategory: 'OTROS' },
  { id: 17, title: 'Goku Gym Fitness', image: '/gym-goku-v2.jpg', price: '$25.000', category: 'gym', subcategory: 'OTROS' },
  
  // Simpsons / 90s
  { id: 18, title: 'Homero No Beer No TV', image: '/simpsons-homero.jpg', price: '$25.000', category: 'simpsons', subcategory: 'Amarillos' },
  { id: 19, title: 'He-Man Power', image: '/heman-shirt.png', price: '$25.000', category: 'simpsons', subcategory: 'TV Clásica' },
  { id: 20, title: 'Dragon Ball Z', image: '/dbz-goku-classic.jpg', price: '$25.000', category: 'simpsons', subcategory: 'TV Clásica' },
  { id: 21, title: 'Seiya Cosmos', image: '/caballeros-shirt.png', price: '$25.000', category: 'simpsons', subcategory: 'TV Clásica' },

  // Argentina
  { id: 22, title: 'Messi Campeón', image: '/arg-messi.png', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 23, title: 'Las 3 Estrellas', image: '/arg-stars.png', price: '$25.000', category: 'argentina', subcategory: 'Scaloneta ⭐⭐⭐' },
  { id: 24, title: 'Dibu Bailando', image: '/arg-dibu.png', price: '$25.000', category: 'argentina', subcategory: 'Scaloneta ⭐⭐⭐' },
  { id: 25, title: 'Escudo Dorado', image: '/arg-shield.png', price: '$25.000', category: 'argentina', subcategory: 'Orgullo Nacional' },
  { id: 30, title: 'Maradona Al Amigo', image: '/arg-maradona-86.jpg', price: '$25.000', category: 'argentina', subcategory: 'Maradona' },
  { id: 31, title: 'Maradona Rostro', image: '/arg-maradona-rostro.jpg', price: '$25.000', category: 'argentina', subcategory: 'Maradona' },
  { id: 32, title: 'Maradona 86', image: '/arg-maradona-amigo.jpg', price: '$25.000', category: 'argentina', subcategory: 'Maradona' },
  { id: 33, title: 'Messi Leyenda', image: '/arg-messi-1.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 34, title: 'Messi Copa', image: '/arg-messi-2.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 35, title: 'Messi Sprite', image: '/arg-messi-3.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 36, title: 'Messi GOAT', image: '/arg-messi-4.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 37, title: 'Messi Collage', image: '/arg-messi-5.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 38, title: 'Messi Oscuro', image: '/arg-messi-6.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 39, title: 'Messi Electric', image: '/arg-messi-7.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 40, title: 'Messi Road to 2026', image: '/arg-messi-8.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  { id: 41, title: 'Messi Glorioso', image: '/arg-messi-9.jpg', price: '$25.000', category: 'argentina', subcategory: 'Messi' },
  
  // Nuevos ingresos
  { id: 26, title: 'Kratos Gym', image: '/gym-kratos.png', price: '$25.000', category: 'gym', subcategory: 'OTROS' },
  { id: 27, title: 'The Joker Gym', image: '/gym-joker.png', price: '$25.000', category: 'gym', subcategory: 'OTROS' },
  { id: 28, title: 'Mumm-Ra Gym', image: '/gym-mummra.png', price: '$25.000', category: 'gym', subcategory: 'OTROS' },
  { id: 29, title: 'Snake Mountain Gym', image: '/gym-skeletor.png', price: '$25.000', category: 'gym', subcategory: 'OTROS' }
];

export const getProductsByCategory = (category: Product['category']) => {
  return productsData.filter(p => p.category === category);
};

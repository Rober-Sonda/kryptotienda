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
  { id: 1, title: 'Attack on Titan Elite', image: '/anime-aot.png', price: '$15.99', category: 'anime', subcategory: 'Shonen' },
  { id: 2, title: 'Demon Slayer Spirit', image: '/anime-demon.png', price: '$18.50', category: 'anime', subcategory: 'Shonen' },
  { id: 3, title: 'Naruto Shippuden', image: '/anime-naruto.png', price: '$14.00', category: 'anime', subcategory: 'Clásicos' },
  { id: 4, title: 'Jujutsu Kaisen', image: '/anime-jjk.png', price: '$22.00', category: 'anime', subcategory: 'Modernos' },
  
  // Retro
  { id: 5, title: 'Zelda Master Sword', image: '/retro-zelda.png', price: '$22.00', category: 'retro', subcategory: 'Aventura' },
  { id: 6, title: 'Mario 8-bit', image: '/retro-mario.png', price: '$14.99', category: 'retro', subcategory: 'Nostalgia' },
  { id: 7, title: 'Sonic Retro', image: '/retro-sonic.png', price: '$13.50', category: 'retro', subcategory: 'Nostalgia' },
  { id: 8, title: 'Pac-Man Arcade', image: '/retro-pacman.png', price: '$15.00', category: 'retro', subcategory: 'Arcade' },
  
  // Gym
  { id: 9, title: 'Broly Lift', image: '/nuevos_disenos/broly.png', price: '$22.00', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'white' },
  { id: 10, title: 'Saiyan Fitness', image: '/nuevos_disenos/goku-saiyan.png', price: '$22.00', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'black' },
  { id: 11, title: 'Train Insaiyan', image: '/nuevos_disenos/goku-train.png', price: '$22.00', category: 'gym', subcategory: 'Anime Fitness', mockupBg: 'black' },
  { id: 12, title: 'Galaxy Groot Gym', image: '/nuevos_disenos/groot.png', price: '$22.00', category: 'gym', subcategory: 'OTROS', mockupBg: 'black' },
  { id: 13, title: 'Sumo Gym Honda', image: '/nuevos_disenos/ehonda.png', price: '$22.00', category: 'gym', subcategory: 'OTROS', mockupBg: 'white' },
  
  { id: 14, title: 'Zoro Big or Home', image: '/gym-zoro-v2.jpg', price: '$22.00', category: 'gym', subcategory: 'Anime Fitness' },
  { id: 15, title: 'Luffy Beast Mode', image: '/gym-luffy-v2.jpg', price: '$22.00', category: 'gym', subcategory: 'Anime Fitness' },
  { id: 16, title: 'Gohan One More Rep', image: '/gym-gohan-v2.jpg', price: '$22.00', category: 'gym', subcategory: 'Berserker' },
  { id: 17, title: 'Goku Gym Fitness', image: '/gym-goku-v2.jpg', price: '$22.00', category: 'gym', subcategory: 'Berserker' },
  
  // Simpsons / 90s
  { id: 18, title: 'Homero No Beer No TV', image: '/simpsons-homero.jpg', price: '$22.00', category: 'simpsons', subcategory: 'Amarillos' },
  { id: 19, title: 'He-Man Power', image: '/heman-shirt.png', price: '$19.99', category: 'simpsons', subcategory: 'TV Clásica' },
  { id: 20, title: 'Dragon Ball Z', image: '/dbz-goku-classic.jpg', price: '$21.00', category: 'simpsons', subcategory: 'TV Clásica' },
  { id: 21, title: 'Seiya Cosmos', image: '/caballeros-shirt.png', price: '$23.50', category: 'simpsons', subcategory: 'TV Clásica' },

  // Argentina (La Escaloneta)
  { id: 22, title: 'Messi Campeón', image: '/arg-messi.png', price: '$25.00', category: 'argentina', subcategory: 'Campeones' },
  { id: 23, title: 'Las 3 Estrellas', image: '/arg-stars.png', price: '$24.00', category: 'argentina', subcategory: 'Campeones' },
  { id: 24, title: 'Dibu Bailando', image: '/arg-dibu.png', price: '$22.50', category: 'argentina', subcategory: 'Ídolos' },
  { id: 25, title: 'Escudo Dorado', image: '/arg-shield.png', price: '$23.00', category: 'argentina', subcategory: 'Gloria' }
];

export const getProductsByCategory = (category: Product['category']) => {
  return productsData.filter(p => p.category === category);
};

import Hero from '../components/Hero.tsx';
import CategorySection from '../components/CategorySection.tsx';

import Facilities from '../components/Facilities.tsx';
import TrustedCompanies from '../components/TrustedCompanies.tsx';
import { getProductsByCategory } from '../data/products.ts';

const HomeView: React.FC = () => {
  return (
    <div className="fade-in">
      <Hero />
      <TrustedCompanies />
      
      <div className="container sections-wrapper">
        <CategorySection 
          id="argentina"
          title="La Escaloneta ⭐⭐⭐"
          shortTitle="Argentina"
          items={getProductsByCategory('argentina')}
        />

        <CategorySection 
          id="anime"
          title="Anime Clásico & Actual" 
          items={getProductsByCategory('anime')}
        />

        <CategorySection 
          id="retro"
          title="Videojuegos Clásicos" 
          items={getProductsByCategory('retro')}
        />

        <CategorySection 
          id="gym"
          title="Anime Gym & Fitness"
          shortTitle="Gym"
          items={getProductsByCategory('gym')}
        />
        
        <CategorySection 
          id="simpsons"
          title="Los Simpsons & Clásicos 90s"
          shortTitle="Los Simpsons"
          items={getProductsByCategory('simpsons')}
        />
      </div>
      
      <Facilities />
    </div>
  );
};

export default HomeView;

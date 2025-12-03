import HeroSection from './hero-section';
import HotGames from './hot-games';
import Menus from './menus';

export default function PageContent() {
  return (
    <div className='space-y-12 px-2 md:px-10'>
      <HeroSection />
      <Menus />
      <HotGames />
    </div>
  );
}

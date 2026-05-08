import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const thematicBanners = [
  {
    title: 'Aventura na Selva',
    subtitle: 'Exploradores, mapas, tesouros e animais',
    bg: 'bg-gradient-to-br from-green-600 to-green-800',
    path: '/categoria/aventura',
  },
  {
    title: 'Missão Espacial',
    subtitle: 'Astronautas, robôs e galáxias distantes',
    bg: 'bg-gradient-to-br from-purple-600 to-blue-700',
    path: '/categoria/espaco',
  },
  {
    title: 'Cidade em Ação',
    subtitle: 'Bombeiros, policiais e construtores',
    bg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    path: '/categoria/cidade',
  },
  {
    title: 'Piratas dos Blocos',
    subtitle: 'Navios, capitães e tesouros escondidos',
    bg: 'bg-gradient-to-br from-teal-700 to-cyan-900',
    path: '/categoria/piratas',
  },
  {
    title: 'Colecionáveis Raros',
    subtitle: 'Peças especiais para fãs exigentes',
    bg: 'bg-gradient-to-br from-amber-600 to-orange-700',
    path: '/categoria/colecionaveis',
  },
];

export function ThematicBanners() {
  return (
    <section className="container mx-auto px-4 my-16">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-bold text-foreground mb-1">Banners Temáticos</h2>
        <p className="text-muted-foreground text-sm">
          Explore mundos diferentes e encontre seus personagens favoritos
        </p>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* First two banners - larger */}
        {thematicBanners.slice(0, 2).map((banner, index) => (
          <Link
            key={index}
            to={banner.path}
            className={`${banner.bg} rounded-3xl p-8 min-h-[240px] flex flex-col justify-between text-white hover:scale-105 transition-transform duration-200 overflow-hidden relative group ${
              index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-300" />
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-lg -rotate-6 group-hover:-rotate-12 transition-transform duration-300" />

            <div className="relative z-10">
              <h3 className="text-[24px] font-extrabold mb-2">{banner.title}</h3>
              <p className="text-sm text-white/90">{banner.subtitle}</p>
            </div>

            <Button 
              variant="secondary"
              size="sm"
              className="w-fit relative z-10"
            >
              Explorar
            </Button>
          </Link>
        ))}

        {/* Remaining banners - smaller */}
        {thematicBanners.slice(2).map((banner, index) => (
          <Link
            key={index + 2}
            to={banner.path}
            className={`${banner.bg} rounded-3xl p-6 min-h-[180px] flex flex-col justify-between text-white hover:scale-105 transition-transform duration-200 overflow-hidden relative group`}
          >
            <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-300" />

            <div className="relative z-10">
              <h3 className="text-[20px] font-extrabold mb-1.5">{banner.title}</h3>
              <p className="text-xs text-white/90">{banner.subtitle}</p>
            </div>

            <Button 
              variant="secondary"
              size="sm"
              className="w-fit relative z-10 text-xs h-8"
            >
              Ver coleção
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}

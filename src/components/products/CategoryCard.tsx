import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  path?: string;
}

export function CategoryCard({ name, slug, image, path }: CategoryCardProps) {
  const linkPath = path || `/categoria/${slug}`;
  
  return (
    <Link to={linkPath} className="group">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 md:w-32 md:h-32 xl:w-40 xl:h-40 rounded-full overflow-hidden bg-muted transition-transform group-hover:scale-105 shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-center text-xs md:text-sm xl:text-base">{name}</h3>
      </div>
    </Link>
  );
}

import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type BreadcrumbItem, generateBreadcrumbSchema } from '@/utils/seo';
import StructuredData from './StructuredData';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Componente de breadcrumb com suporte a Schema.org
 * Melhora navegação e SEO
 */
export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Adiciona home como primeiro item se não estiver presente
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Início', url: '/' },
    ...items
  ];

  const schema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <StructuredData data={schema} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = index === 0;

          return (
            <div key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
              )}
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-foreground transition-colors flex items-center"
                >
                  {isHome && <Home className="h-4 w-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

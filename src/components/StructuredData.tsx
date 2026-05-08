import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Componente para adicionar dados estruturados (JSON-LD) ao head da página
 * Suporta Schema.org para melhorar SEO e rich snippets
 */
export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {jsonLd.map((item, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}

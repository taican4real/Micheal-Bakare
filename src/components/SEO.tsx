import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product' | 'music.song' | 'music.album';
  image?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({ title, description, url, type = 'website', image, schema }: SEOProps) {
  const siteUrl = 'https://michaelbakare.com'; // Use a realistic domain for the final product, or the run.app URL.
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image || `${siteUrl}/images/mb-default-og.jpg`; // Fallback image

  // Always include the Person schema for Michael Bakare on every page as the publisher
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Michael Bakare",
    "url": siteUrl,
    "jobTitle": ["Composer", "Music Producer", "Music Director", "Pianist"],
    "sameAs": [
      "https://instagram.com/michaelbakare", // Replace with real links later
      "https://youtube.com/michaelbakare"
    ]
  };

  const schemas = schema ? (Array.isArray(schema) ? [baseSchema, ...schema] : [baseSchema, schema]) : [baseSchema];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Ensure responsive meta is there */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

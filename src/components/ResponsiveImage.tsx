import React from 'react';

interface ResponsiveImageProps extends React.ComponentProps<'img'> {
  className?: string;
  loading?: 'lazy' | 'eager';
  src: string;
  alt: string;
  forceEager?: boolean;
}

export default function ResponsiveImage({ src, alt, className, forceEager, ...props }: ResponsiveImageProps) {
  let srcSet = undefined;
  
  if (src && src.includes('images.unsplash.com')) {
    const urlObj = new URL(src);
    const buildUrl = (width: number) => {
      urlObj.searchParams.set('w', width.toString());
      return urlObj.toString() + ` ${width}w`;
    };
    
    srcSet = [
      buildUrl(400),
      buildUrl(800),
      buildUrl(1200),
      buildUrl(1600),
      buildUrl(2000)
    ].join(', ');
  }

  // Modern browsers support 'fetchpriority'
  const loadingAttr = forceEager ? "eager" : "lazy";
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : undefined}
      alt={alt}
      className={className}
      loading={loadingAttr}
      decoding={forceEager ? "sync" : "async"}
      {...(forceEager ? { fetchPriority: "high" } : {})}
      {...props}
    />
  );
}

import { CarFront } from 'lucide-react';
import { useState } from 'react';
import { safeImageUrl } from '@/lib/safeUrl';
import { cn } from '@/lib/utils';

// Image filtrée (URL sûres uniquement) avec vignette de remplacement si elle ne charge pas
export function SafeImage({ src, alt = '', className, icon: Icon = CarFront, ...props }) {
  const url = safeImageUrl(src);
  const [failedUrl, setFailedUrl] = useState(null);

  if (!url || failedUrl === url) {
    return (
      <span
        className={cn('image-fallback', className)}
        role="img"
        aria-label={alt || 'Image indisponible'}
      >
        <Icon aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedUrl(url)}
      className={className}
      {...props}
    />
  );
}

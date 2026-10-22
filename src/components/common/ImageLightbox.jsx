import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

// Agrandissement d'image(s) ; images = [url], index contrôlé par le parent
export function ImageLightbox({ images, index, onIndexChange, onClose, alt = 'Vue agrandie' }) {
  const open = index !== null && index !== undefined;
  const count = images.length;
  const go = (step) => onIndexChange((index + step + count) % count);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="lightbox"
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === 'ArrowRight') go(1);
          if (event.key === 'ArrowLeft') go(-1);
        }}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">Image agrandie du véhicule</DialogDescription>
        {open && <SafeImage src={images[index]} alt={alt} className="lightbox__image" />}
        {count > 1 && (
          <>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => go(-1)}
              aria-label="Image précédente"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              onClick={() => go(1)}
              aria-label="Image suivante"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <p className="lightbox__counter">
              {index + 1} / {count}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

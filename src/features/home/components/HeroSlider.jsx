import { ChevronLeft, ChevronRight, Phone, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SafeImage } from '@/components/common/SafeImage';
import { HERO_SLIDES } from '@/features/home/content';
import { cn } from '@/lib/utils';

const AUTOPLAY_DELAY = 5000;
const COUNT = HERO_SLIDES.length;

// Fond chargé uniquement pour les diapositives déjà vues ou sur le point de l'être
const bgStyle = (slide, load) =>
  load
    ? { '--hero-bg': `url(${slide.background})`, '--hero-bg-sm': `url(${slide.backgroundSm})` }
    : undefined;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0, 1 % COUNT]));
  const go = (step) => setCurrent((index) => (index + step + COUNT) % COUNT);

  useEffect(() => {
    const next = (current + 1) % COUNT;
    setLoaded((prev) =>
      prev.has(current) && prev.has(next) ? prev : new Set([...prev, current, next])
    );
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((index) => (index + 1) % COUNT), AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" aria-label="Nos véhicules à la une">
      {HERO_SLIDES.map((slide, index) => (
        <article
          key={slide.id}
          className={cn('hero__slide', index === current && 'hero__slide--active')}
          style={bgStyle(slide, loaded.has(index))}
          inert={index !== current}
        >
          <div className="hero__overlay" />
          <div className="hero__content">
            <div className="hero__text">
              <span className="hero__badge">{slide.badge}</span>
              <h1 className="hero__title">{slide.title}</h1>
              <p className="hero__subtitle">{slide.subtitle}</p>
              <p className="hero__description">{slide.description}</p>
              <div className="hero__actions">
                <Link to="/vehicles" className="hero__cta">
                  Découvrir nos véhicules <ChevronRight aria-hidden="true" />
                </Link>
                <Link to="/contact" className="hero__cta hero__cta--ghost">
                  <Phone aria-hidden="true" /> Nous contacter
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <div className={cn('hero__glow', `hero__glow--${slide.glow}`)} aria-hidden="true" />
              <div className="hero__card">
                <span className="hero__premium">
                  <Star aria-hidden="true" /> PREMIUM
                </span>
                <SafeImage
                  src={slide.carImage}
                  alt="Véhicule premium"
                  className="hero__car"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
                <p className="hero__availability">Véhicules disponibles immédiatement</p>
              </div>
            </div>
          </div>
        </article>
      ))}

      <button
        type="button"
        className="hero__nav hero__nav--prev"
        onClick={() => go(-1)}
        aria-label="Diapositive précédente"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hero__nav hero__nav--next"
        onClick={() => go(1)}
        aria-label="Diapositive suivante"
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <div className="hero__dots">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(index)}
            className={cn('hero__dot', index === current && 'hero__dot--active')}
            aria-label={`Diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

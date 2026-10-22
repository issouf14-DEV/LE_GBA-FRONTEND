import { FeatureGrid } from '@/components/common/FeatureCard';
import { PageHero } from '@/components/common/PageHero';
import { CtaBanner } from '@/features/company/components/CtaBanner';
import { REASONS, SERVICES } from '@/features/company/content';

export default function Services() {
  return (
    <div className="page">
      <PageHero
        title="Nos services"
        subtitle="Des solutions complètes et personnalisées pour tous vos besoins automobiles"
      />

      <section className="section">
        <div className="page-container">
          <header className="section-header">
            <h2 className="section-title">Services complets</h2>
            <p className="section-subtitle">
              Une gamme complète de services pour vous accompagner à chaque étape
            </p>
          </header>
          <FeatureGrid items={SERVICES} variant="elevated" />
        </div>
      </section>

      <CtaBanner />

      <section className="section section--muted">
        <div className="page-container">
          <h2 className="section-title section-title--center">Pourquoi choisir LE-GBA ?</h2>
          <FeatureGrid items={REASONS} variant="accent" />
        </div>
      </section>
    </div>
  );
}

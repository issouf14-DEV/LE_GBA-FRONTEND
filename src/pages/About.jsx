import { FeatureGrid } from '@/components/common/FeatureCard';
import { PageHero } from '@/components/common/PageHero';
import { SafeImage } from '@/components/common/SafeImage';
import { STATS, VALUES } from '@/features/company/content';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80&auto=format';

export default function About() {
  return (
    <div className="page">
      <PageHero
        title="À propos de LE-GBA"
        subtitle="Votre partenaire de confiance pour l'acquisition de véhicules premium en Côte d'Ivoire"
      />

      <section className="about-story">
        <SafeImage
          src={STORY_IMAGE}
          alt="Véhicules premium LE-GBA"
          className="about-story__image"
        />
        <div className="about-story__text">
          <p className="eyebrow">Notre histoire</p>
          <h2 className="section-title">Un engagement envers l'excellence</h2>
          <p>
            Depuis notre création, <strong>LE-GBA</strong> s'est imposé comme un acteur majeur du
            secteur automobile en Côte d'Ivoire. Notre engagement envers l'excellence et la
            satisfaction client nous a permis de construire une réputation solide dans le domaine
            des véhicules premium.
          </p>
          <p>
            Notre mission : offrir une expérience automobile exceptionnelle, avec une sélection
            rigoureuse de véhicules de qualité et un service client irréprochable.
          </p>
        </div>
      </section>

      <section className="stats-band">
        <ul className="stats-band__grid">
          {STATS.map(({ value, label, icon: Icon }) => (
            <li key={label} className="stat">
              <span className="stat__icon">
                <Icon aria-hidden="true" />
              </span>
              <p className="stat__value">{value}</p>
              <p className="stat__label">{label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="page-container">
          <header className="section-header">
            <p className="eyebrow">Ce qui nous définit</p>
            <h2 className="section-title">Nos valeurs</h2>
          </header>
          <FeatureGrid items={VALUES} />
        </div>
      </section>
    </div>
  );
}

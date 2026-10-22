import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

const ITEMS = [
  { icon: Phone, title: 'Téléphone', content: COMPANY.phone, href: COMPANY.phoneHref },
  { icon: Mail, title: 'Email', content: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: MapPin, title: 'Adresse', content: COMPANY.address },
  {
    icon: Clock,
    title: "Heures d'ouverture",
    content: 'Lun - Sam : 8h - 18h',
    note: 'Fermé le dimanche',
  },
];

export function ContactInfo() {
  return (
    <div className="contact-info">
      <h2 className="contact-card__title">Nos coordonnées</h2>
      <p className="contact-info__intro">
        N'hésitez pas à nous contacter par téléphone, email ou en visitant notre showroom.
      </p>
      <ul className="contact-info__list">
        {ITEMS.map(({ icon: Icon, title, content, href, note }) => (
          <li key={title} className="contact-info__item">
            <span className="contact-info__icon">
              <Icon aria-hidden="true" />
            </span>
            <div>
              <h3 className="contact-info__title">{title}</h3>
              {href ? (
                <a href={href} className="contact-info__value contact-info__value--link">
                  {content}
                </a>
              ) : (
                <p className="contact-info__value">{content}</p>
              )}
              {note && <p className="contact-info__note">{note}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="contact-map">
        <iframe
          title="Carte de localisation"
          src={COMPANY.mapEmbed}
          loading="lazy"
          className="contact-map__frame"
        />
      </div>
    </div>
  );
}

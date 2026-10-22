import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY } from '@/lib/constants';

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'WhatsApp', href: COMPANY.whatsapp, icon: MessageCircle },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

const NAVIGATION = [
  { to: '/', label: 'Accueil' },
  { to: '/vehicles', label: 'Nos véhicules' },
  { to: '/about', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const SERVICES = [
  'Vente de véhicules neufs',
  "Vente de véhicules d'occasion",
  'Financement automobile',
  'Garantie étendue',
  'Livraison à domicile',
];

const CONTACTS = [
  { icon: Phone, label: COMPANY.phone, href: COMPANY.phoneHref },
  { icon: Mail, label: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: MapPin, label: COMPANY.address },
  { icon: Clock, label: 'Lun-Sam : 8h-18h' },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__accent" />
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="footer-col">
            <p className="footer-brand">{COMPANY.name}</p>
            <p className="footer-text">
              Votre partenaire automobile de confiance en Côte d'Ivoire. Qualité, fiabilité et
              excellence.
            </p>
            <div className="footer-socials">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social"
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-title">Navigation</p>
            <ul className="footer-list">
              {NAVIGATION.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-title">Nos services</p>
            <ul className="footer-list">
              {SERVICES.map((service) => (
                <li key={service} className="footer-text">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-title">Contact</p>
            <ul className="footer-list">
              {CONTACTS.map(({ icon: Icon, label, href }) => {
                const content = (
                  <>
                    <Icon className="footer-contact__icon" aria-hidden="true" />
                    <span>{label}</span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="footer-contact footer-contact--link">
                        {content}
                      </a>
                    ) : (
                      <span className="footer-contact">{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="footer-brand-inline">{COMPANY.name}</span>. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

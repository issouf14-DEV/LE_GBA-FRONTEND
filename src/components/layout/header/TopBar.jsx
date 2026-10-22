import { Facebook, Instagram, Linkedin, Phone } from 'lucide-react';
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants';

const ICONS = { Facebook, Instagram, LinkedIn: Linkedin };

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__inner">
        <div className="topbar__socials">
          {SOCIAL_LINKS.map(({ label, href }) => {
            const Icon = ICONS[label];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="topbar__social"
                aria-label={label}
              >
                <Icon aria-hidden="true" />
              </a>
            );
          })}
        </div>
        <a href={COMPANY.phoneHref} className="topbar__phone">
          <Phone aria-hidden="true" />
          <span className="topbar__phone-number">{COMPANY.phone}</span>
        </a>
      </div>
    </div>
  );
}

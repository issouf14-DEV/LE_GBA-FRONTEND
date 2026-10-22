// Coordonnées de l'entreprise (une seule source pour Header, Footer, Contact, PDF)
export const COMPANY = {
  name: 'LE-GBA',
  tagline: 'Location de véhicules de luxe',
  phone: '05 03 71 31 15',
  phoneHref: 'tel:+2250503713115',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'fofanaissouf179@gmail.com',
  whatsapp: 'https://wa.me/2250503713115',
  address: 'Abidjan, Côte d’Ivoire',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.4379659750466!2d-3.9962653!3d5.3483568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjAnMzQuMCJOIDPCsDU5JzQ2LjYiVw!5e0!3m2!1sfr!2sci!4v1635180762111!5m2!1sfr!2sci',
};

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];

export const IMAGE_RULES = {
  types: ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 2 * 1024 * 1024,
};

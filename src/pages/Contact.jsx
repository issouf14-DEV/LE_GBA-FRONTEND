import { PageHero } from '@/components/common/PageHero';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { ContactInfo } from '@/features/contact/components/ContactInfo';

export default function Contact() {
  return (
    <div className="page">
      <PageHero
        title="Contactez-nous"
        subtitle="Notre équipe est à votre disposition pour répondre à toutes vos questions"
      />
      <div className="page-container page-container--padded">
        <div className="contact-layout">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}

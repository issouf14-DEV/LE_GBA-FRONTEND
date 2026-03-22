import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Ligne rouge en haut */}
      <div className="h-1 bg-gradient-to-r from-red-800 via-red-700 to-red-800"></div>

      <div className="container mx-auto px-4 py-12">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* A propos */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-red-600">LE-GBA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre partenaire automobile de confiance en Côte d'Ivoire. Qualité, fiabilité et excellence.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <FaInstagram className="text-sm" />
              </a>
              <a href="https://wa.me/2250503713115" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <FaWhatsapp className="text-sm" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/vehicles', label: 'Nos véhicules' },
                { to: '/about', label: 'À propos' },
                { to: '/services', label: 'Services' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Nos Services</h4>
            <ul className="space-y-2">
              {[
                'Vente de véhicules neufs',
                'Vente de véhicules d\'occasion',
                'Financement automobile',
                'Garantie étendue',
                'Livraison à domicile',
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+2250503713115" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaPhone className="text-red-600 flex-shrink-0" />
                  <span>05 03 71 31 15</span>
                </a>
              </li>
              <li>
                <a href="mailto:fofanaissouf179@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <FaEnvelope className="text-red-600 flex-shrink-0" />
                  <span>fofanaissouf179@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <FaMapMarkerAlt className="text-red-600 flex-shrink-0" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <FaClock className="text-red-600 flex-shrink-0" />
                  <span>Lun-Sam: 8h-18h</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-800 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2025 <span className="text-red-600 font-semibold">LE-GBA</span>. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/legal" className="hover:text-gray-300 transition-colors">Mentions légales</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

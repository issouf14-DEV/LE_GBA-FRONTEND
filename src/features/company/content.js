import {
  Award,
  Building2,
  Car,
  Clock,
  CreditCard,
  Gem,
  Shield,
  ShieldCheck,
  Target,
  Trophy,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

export const STATS = [
  { value: '10+', label: "Années d'expérience", icon: Building2 },
  { value: '1000+', label: 'Clients satisfaits', icon: Users },
  { value: '150+', label: 'Véhicules vendus', icon: Trophy },
  { value: '98%', label: 'Taux de satisfaction', icon: Target },
];

export const VALUES = [
  {
    icon: Award,
    title: 'Excellence',
    text: 'Nous maintenons les plus hauts standards de qualité dans tous nos services.',
  },
  {
    icon: Shield,
    title: 'Intégrité',
    text: "La transparence et l'honnêteté sont au cœur de toutes nos interactions.",
  },
  {
    icon: Zap,
    title: 'Innovation',
    text: 'Nous adoptons les dernières technologies pour améliorer notre service.',
  },
];

export const SERVICES = [
  {
    icon: Car,
    title: 'Vente de véhicules',
    text: "Large sélection de véhicules premium neufs et d'occasion soigneusement inspectés.",
  },
  {
    icon: ShieldCheck,
    title: 'Garantie étendue',
    text: 'Protection complète pour votre véhicule avec des options de garantie flexibles.',
  },
  {
    icon: Wrench,
    title: 'Service après-vente',
    text: 'Entretien professionnel et réparations par des techniciens qualifiés.',
  },
  {
    icon: CreditCard,
    title: 'Solutions de financement',
    text: 'Options de financement personnalisées pour répondre à vos besoins.',
  },
  {
    icon: Clock,
    title: 'Assistance 24/7',
    text: 'Support technique et assistance routière disponibles 24h/24 et 7j/7.',
  },
  {
    icon: UserCheck,
    title: 'Conseil personnalisé',
    text: 'Accompagnement expert pour trouver le véhicule parfait selon vos critères.',
  },
];

export const REASONS = [
  {
    icon: Trophy,
    title: 'Expertise reconnue',
    text: 'Notre équipe possède une expertise approfondie dans le secteur automobile premium.',
  },
  {
    icon: Gem,
    title: 'Service premium',
    text: 'Un service client exceptionnel et personnalisé pour chacun de nos clients.',
  },
  {
    icon: Target,
    title: 'Solutions complètes',
    text: 'De la recherche du véhicule à la livraison, nous vous accompagnons à chaque étape.',
  },
];

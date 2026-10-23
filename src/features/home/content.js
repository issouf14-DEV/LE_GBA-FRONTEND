// Contenu éditorial de la page d'accueil (aucune donnée de commande ici)
const unsplash = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format`;

export const HERO_SLIDES = [
  {
    id: 'news',
    background: unsplash('1549399542-7e3f8b79c341', 1600),
    backgroundSm: unsplash('1549399542-7e3f8b79c341', 800),
    carImage: unsplash('1503736334956-4c8f8e92946d'),
    badge: `Nouveautés ${new Date().getFullYear()}`,
    title: 'Votre voyage commence ici',
    subtitle: "Des véhicules d'exception pour des moments inoubliables",
    description:
      'Découvrez notre collection exclusive de véhicules premium. Performance, confort et technologie de pointe pour une expérience de conduite inégalée.',
    glow: 'red',
  },
  {
    id: 'electric',
    background: unsplash('1492144534655-ae79c964c9d7', 1600),
    backgroundSm: unsplash('1492144534655-ae79c964c9d7', 800),
    carImage: unsplash('1593941707882-a5bba14938c7'),
    badge: '100 % électrique',
    title: "L'avenir est électrique",
    subtitle: 'Performances et écologie réunies',
    description:
      "Autonomie exceptionnelle, recharge rapide et zéro émission. Vivez l'expérience de la mobilité durable sans compromis.",
    glow: 'green',
  },
  {
    id: 'hybrid',
    background: unsplash('1542362567-b07e54358753', 1600),
    backgroundSm: unsplash('1542362567-b07e54358753', 800),
    carImage: unsplash('1617469767053-d3b523a0b982'),
    badge: 'Hybride',
    title: 'Le meilleur des deux mondes',
    subtitle: 'Hybride rechargeable',
    description:
      'Combinez puissance thermique et efficacité électrique. La technologie hybride pour une conduite intelligente et économique.',
    glow: 'blue',
  },
];

export const OFFERS = [
  {
    id: 'peugeot-208',
    title: 'Peugeot 208',
    monthlyPrice: '130 250 FCFA/mois',
    image: unsplash('1503376780353-7e6692767b70', 800),
    search: '208',
  },
  {
    id: 'id3',
    title: 'ID.3 100 % électrique',
    monthlyPrice: '195 570 FCFA/mois',
    image: unsplash('1593941707882-a5bba14938c7', 800),
    search: 'ID.3',
  },
  {
    id: 't-roc',
    title: 'T-Roc VW Edition',
    monthlyPrice: '228 570 FCFA/mois',
    image: unsplash('1581540222194-0def2dda95b8', 800),
    badge: 'Sans frais de dossier',
    search: 'T-Roc',
  },
];

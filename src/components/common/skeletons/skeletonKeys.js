// Clés stables pour les listes de skeletons (évite les index comme clés React)
export const skeletonKeys = (count, prefix = 'skeleton') =>
  Array.from({ length: count }, (_, position) => `${prefix}-${position + 1}`);

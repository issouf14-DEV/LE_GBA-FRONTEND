// Lecture sûre dans une table : une clé comme « constructor » ou « __proto__ » ne renvoie
// jamais une propriété héritée de JavaScript (confusion de prototype)
export const ownValue = (map, key, fallback) =>
  typeof key === 'string' && Object.hasOwn(map, key) ? map[key] : fallback;

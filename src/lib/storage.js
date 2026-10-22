// Accès sûr au stockage du navigateur : ne lève jamais d'exception
// (navigation privée, stockage bloqué, JSON corrompu…)
function createStorage(getArea) {
  const area = () => {
    try {
      return getArea();
    } catch {
      return null;
    }
  };

  return {
    get(key) {
      try {
        return area()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        area()?.setItem(key, value);
      } catch {
        // quota dépassé ou stockage bloqué : on ignore
      }
    },
    remove(key) {
      try {
        area()?.removeItem(key);
      } catch {
        // stockage bloqué : on ignore
      }
    },
    getJSON(key, fallback = null) {
      try {
        const raw = area()?.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    setJSON(key, value) {
      this.set(key, JSON.stringify(value));
    },
  };
}

// Conservé entre les visites (panier, photo de profil)
export const storage = createStorage(() => window.localStorage);

// Effacé à la fermeture de l'onglet (données liées à la session en cours)
export const sessionStore = createStorage(() => window.sessionStorage);

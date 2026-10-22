import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/common/toast/ToastProvider';
import { AuthContext } from '@/features/auth/context/authContext';
import { CartProvider } from '@/features/cart/context/CartProvider';

export const testUser = { id: 'u1', name: 'Awa Koné', email: 'awa@example.com', role: 'user' };

export function authValue(overrides = {}) {
  const user = 'user' in overrides ? overrides.user : testUser;
  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    sessionStatus: 'verified',
    login: async () => ({ success: true }),
    register: async () => ({ success: true }),
    logout: async () => {},
    fetchUser: async () => {},
    updateUser: () => {},
    ...overrides,
  };
}

// Rend un composant avec les fournisseurs de l'application (routeur, session, panier, toasts)
export function renderWithProviders(ui, { auth = {}, route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ToastProvider>
        <AuthContext.Provider value={authValue(auth)}>
          <CartProvider>{ui}</CartProvider>
        </AuthContext.Provider>
      </ToastProvider>
    </MemoryRouter>
  );
}

// Charges utiles XSS classiques
export const XSS = {
  script: '<script>window.__xss = true</script>',
  img: '<img src=x onerror="window.__xss = true">',
  svg: '<svg onload="window.__xss = true"></svg>',
  jsUrl: 'javascript:window.__xss = true',
  svgData: 'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIj48L3N2Zz4=',
};

// Vérifie qu'aucun élément ou attribut actif n'a été injecté dans le rendu
export function expectNoInjectedMarkup(container) {
  const dangerous = container.querySelectorAll('script, iframe, object, embed, svg[onload]');
  for (const element of dangerous) {
    if (element.tagName !== 'svg' || element.getAttribute('onload')) {
      throw new Error(`Élément injecté : <${element.tagName.toLowerCase()}>`);
    }
  }
  for (const element of container.querySelectorAll('*')) {
    for (const attribute of element.attributes) {
      if (attribute.name.startsWith('on')) throw new Error(`Attribut injecté : ${attribute.name}`);
    }
  }
  for (const element of container.querySelectorAll('[src], [href]')) {
    const url = element.getAttribute('src') || element.getAttribute('href');
    if (/^\s*(javascript|vbscript|data:text|data:image\/svg)/i.test(url)) {
      throw new Error(`URL dangereuse : ${url}`);
    }
  }
}

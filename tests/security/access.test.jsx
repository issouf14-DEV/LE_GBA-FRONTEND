// Niveau 6 : contrôle d'accès de l'interface (le serveur reste l'autorité finale)
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/guards';
import { UserTable } from '@/features/admin/users/components/UserTable';
import { AuthContext } from '@/features/auth/context/authContext';
import { authValue, testUser } from '../helpers/render';

afterEach(cleanup);

function renderAt(path, auth) {
  return render(
    <AuthContext.Provider value={authValue(auth)}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<p>Accueil</p>} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <p>Connexion</p>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <p>Profil</p>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <p>Admin</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

const admin = { ...testUser, id: 'a1', role: 'admin' };

describe('Pages protégées', () => {
  it('visiteur non connecté renvoyé vers la connexion', () => {
    renderAt('/profile', { user: null });
    expect(screen.getByText('Connexion')).toBeTruthy();
  });

  it('client connecté : accès à son profil', () => {
    renderAt('/profile', {});
    expect(screen.getByText('Profil')).toBeTruthy();
  });

  it('rien n’est affiché tant que le serveur n’a pas confirmé la session', () => {
    renderAt('/admin', { user: admin, sessionStatus: 'checking' });
    expect(screen.queryByText('Admin')).toBeNull();
    expect(screen.getByRole('status')).toBeTruthy();
  });
});

describe('Pages d’administration', () => {
  it('un client est renvoyé vers l’accueil', () => {
    renderAt('/admin', {});
    expect(screen.queryByText('Admin')).toBeNull();
    expect(screen.getByText('Accueil')).toBeTruthy();
  });

  it('un rôle falsifié (« Admin », « administrator ») ne donne pas accès', () => {
    for (const role of ['Admin', 'administrator', 'admin ']) {
      cleanup();
      renderAt('/admin', { user: { ...testUser, role }, isAdmin: false });
      expect(screen.queryByText('Admin')).toBeNull();
    }
  });

  it('un admin confirmé par le serveur accède à l’administration', () => {
    renderAt('/admin', { user: admin });
    expect(screen.getByText('Admin')).toBeTruthy();
  });
});

describe('Connexion déjà ouverte', () => {
  it('la page de connexion redirige un utilisateur connecté', () => {
    renderAt('/login', {});
    expect(screen.getByText('Accueil')).toBeTruthy();
  });
});

describe('Un admin ne peut pas se supprimer ni se rétrograder', () => {
  it('ses propres boutons sont désactivés, pas ceux des autres', () => {
    const users = [admin, { ...testUser, _id: 'u2', email: 'b@example.com' }];
    render(
      <MemoryRouter>
        <UserTable users={users} currentUserId="a1" onRoleChange={() => {}} onDelete={() => {}} />
      </MemoryRouter>
    );
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
    const roleSelects = screen.getAllByRole('combobox');
    expect(deleteButtons[0].disabled).toBe(true);
    expect(roleSelects[0].disabled).toBe(true);
    expect(deleteButtons[1].disabled).toBe(false);
    expect(roleSelects[1].disabled).toBe(false);
  });
});

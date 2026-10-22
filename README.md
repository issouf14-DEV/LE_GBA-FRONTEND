# LE-GBA

Plateforme de location de véhicules premium : catalogue, réservation en ligne, suivi des commandes et espace d'administration.

## Fonctionnalités

**Côté client**

- Catalogue de véhicules avec recherche, filtres par motorisation, prix et année
- Fiche détaillée de chaque véhicule
- Panier et réservation en trois étapes (coordonnées, dates, paiement)
- Suivi des réservations et historique téléchargeable en PDF
- Espace personnel : profil, photo, changement de mot de passe

**Côté administration**

- Tableau de bord : chiffres clés et graphiques d'activité
- Gestion des véhicules, des utilisateurs et des réservations
- Notifications des nouvelles commandes

## Technologies

React 19 · Vite 7 · React Router 7 · Tailwind CSS 3 · shadcn/ui · Zod · Recharts · Lucide

## Installation

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Aperçu du build |
| `npm run format` | Formatage du code (Biome) |
| `npm run check` | Lint et formatage (Biome) |
| `npm run lint` | Règles React (ESLint) |
| `npm run check:size` | Contrôle de la taille des fichiers |
| `npm test` | Tests de sécurité automatisés |
| `npm run test:e2e` | Test d'intrusion du build dans un vrai navigateur (Chrome ou Edge requis) |
| `npm run verify` | Toutes les vérifications, les tests, le build et le contrôle du bundle, **à lancer avant chaque push** |

## Structure

```
src/
├── app/          Application, routes, contrôle d'accès
├── api/          Accès à l'API
├── components/
│   ├── ui/       Composants shadcn/ui
│   ├── common/   Composants partagés
│   └── layout/   En-tête, pied de page, mises en page
├── features/     Une fonctionnalité par dossier (composants, hooks, schémas, logique)
├── hooks/        Hooks partagés
├── lib/          Utilitaires
├── pages/        Pages de l'application
└── styles/       Feuille de style unique
```

## Qualité du code

Le projet suit quelques règles simples pour rester lisible et facile à maintenir :

- **Des fichiers courts** : 150 lignes au maximum, grâce à des composants et des hooks réutilisables.
- **Des styles séparés** : toute la mise en forme se trouve dans la feuille de style, jamais dans les composants.
- **Une interface cohérente** : composants shadcn/ui, icônes Lucide, skeletons pendant les chargements.
- **Des formulaires fiables** : chaque saisie est validée avant d'être envoyée.
- **Un code vérifié** : formatage, lint, tests et build sont contrôlés par `npm run verify` avant chaque envoi.
- **Une sécurité testée** : des tests automatisés et un test d'intrusion en navigateur vérifient les protections à chaque modification.

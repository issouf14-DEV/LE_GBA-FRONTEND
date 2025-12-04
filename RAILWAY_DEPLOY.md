# Déploiement sur Railway

## 🚀 Étapes de déploiement

### 1. Créer un compte Railway
- Allez sur https://railway.app
- Connectez-vous avec votre compte GitHub

### 2. Créer un nouveau projet
1. Cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez le repository **LE_GBA-FRONTEND**
4. Railway détectera automatiquement le Dockerfile

### 3. Configuration des variables d'environnement
Dans les settings du projet Railway, ajoutez :
```
VITE_API_URL=https://le-gba-backend.onrender.com
```

### 4. Déploiement automatique
- Railway déploiera automatiquement à chaque push sur GitHub
- Le build prendra environ 2-3 minutes
- Vous recevrez une URL publique : `https://votre-app.up.railway.app`

## 📁 Fichiers de configuration créés

### `Dockerfile`
- Build en 2 étapes (Node.js pour build + Nginx pour production)
- Optimisé pour les applications React/Vite
- Nginx configuré pour le routing SPA

### `nginx.conf`
- Routing SPA (tous les chemins → index.html)
- Proxy API vers le backend Render
- Cache pour les assets statiques
- Compression gzip activée

### `railway.toml`
- Configuration Railway
- Politique de redémarrage automatique en cas d'erreur

## ✅ Avantages Railway vs Vercel

- ✅ Meilleur support Docker
- ✅ Plus de contrôle sur le serveur (Nginx)
- ✅ Déploiement plus stable
- ✅ Logs plus détaillés
- ✅ Gratuit pour commencer (500h/mois)

## 🔧 Commandes utiles

```bash
# Test local du build
npm run build

# Preview local (simule Railway)
npm run start
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Railway Dashboard
2. Assurez-vous que VITE_API_URL est bien configuré
3. Vérifiez que le build se termine sans erreur

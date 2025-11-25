# 🏛️ BrandArchitect

Une application web pour accompagner le jeu de société **BrandArchitect** - un jeu où les joueurs construisent des logos de marques avec des formes géométriques tout en essayant de démasquer le saboteur !

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## 🎮 Le Jeu

### Concept
À chaque round, un joueur devient l'**Architecte** et doit construire un logo de marque avec des formes géométriques. Les autres joueurs doivent deviner la marque... mais attention, un **Saboteur** parmi eux essaie de les induire en erreur !

### Rôles
- 🏛️ **Architecte** - Construit le logo de la marque assignée
- 👁️ **Joueurs** - Observent et devinent la marque
- 🎭 **Saboteur** - Essaie de convaincre les autres de voter pour une mauvaise marque

### Conditions de victoire
- ✅ **Les Joueurs gagnent** si après le tour de table complet, le saboteur n'a jamais réussi à les tromper
- ❌ **Le Saboteur gagne** dès qu'il réussit à faire voter les joueurs pour la mauvaise marque

## 🚀 Démarrage rapide

### Prérequis
- Docker et Docker Compose
- Node.js 20+ (pour le développement local)

### Avec Docker (Recommandé)

```bash
# Cloner le projet
git clone <repo-url>
cd brand-architect

# Créer le fichier .env
cp env.example .env

# Ajouter votre clé LogoDev dans .env
LOGODEV_API_KEY="votre_cle"

# Lancer les services (build + run)
docker compose up --build -d
```

L'application sera disponible sur http://localhost:3000

> ℹ️ Le conteneur `app` applique automatiquement le schéma Prisma (`prisma db push`) et synchronise les marques depuis `data/brands.json`.  
> Utilisez `SKIP_DB_SETUP=true` ou `SKIP_DB_SEED=true` dans votre `.env`/`docker-compose.yml` si vous souhaitez désactiver ces étapes.

### Développement local

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp env.example .env

# Lancer la base de données PostgreSQL
docker compose up db -d

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Peupler la base avec les marques
npm run db:seed

# Lancer le serveur de développement
npm run dev
```

## 📁 Structure du projet

```
brand-architect/
├── prisma/
│   ├── schema.prisma      # Schéma de la base de données
│   └── seed.js            # Synchronisation des marques
├── src/
│   ├── app/
│   │   ├── api/           # Routes API
│   │   ├── game/          # Pages du jeu
│   │   ├── new-game/      # Création de partie
│   │   ├── rules/         # Règles du jeu
│   │   └── page.tsx       # Page d'accueil
│   ├── components/        # Composants React
│   └── lib/               # Utilitaires et store
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🎨 Stack technique

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Animations**: Framer Motion
- **Base de données**: PostgreSQL 16 avec Prisma ORM
- **State management**: Zustand
- **Containerisation**: Docker & Docker Compose

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Lancer en production
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer le schéma
npm run db:migrate   # Créer une migration
npm run db:seed      # Peupler la base
npm run db:studio    # Interface Prisma Studio
```

## 📱 Fonctionnalités

- ✅ Création de partie avec nombre de joueurs variable (3-10)
- ✅ Révélation des rôles de manière secrète (passage du téléphone)
- ✅ Gestion des rounds avec rotation de l'architecte
- ✅ Base de données de marques célèbres avec descriptions
- ✅ Système de victoire/défaite
- ✅ Interface responsive et mobile-first
- ✅ Animations fluides et effets visuels

## 🎯 Marques incluses

L'application contient plus de 40 marques célèbres dans différentes catégories :
- 🏃 Sport (Nike, Adidas, Puma...)
- 💻 Tech (Apple, Google, Netflix...)
- 🚗 Automobile (Mercedes, BMW, Ferrari...)
- 🍔 Alimentation (McDonald's, Starbucks, Coca-Cola...)
- 👔 Mode (Chanel, Louis Vuitton, Lacoste...)

## 📄 Licence

MIT


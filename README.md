<div align="center" style="background-color: white; padding: 20px; border-radius: 10px;">
  <img src="public/assets/logo.png" alt="Feebdack Logo" width="300"/>
  <p>Outil de gestion de feedback pour vos projets web</p>
      
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  
</div>

---

##  À propos

**Feebdack** est une solution  qui permet de collecter, organiser et gérer les retours utilisateurs de vos sites web. Intégrez simplement un widget JavaScript sur votre site et commencez à recevoir des feedbacks structurés de vos utilisateurs.

###  Fonctionnalités principales

-  **Widget intégrable** - Un simple script à ajouter sur votre site
-  **Dashboard Kanban** - Organisez vos feedbacks par statut (À traiter, En cours, Terminé)
-  **Multi-projets** - Gérez jusqu'à 10 sites par compte
---

## 📦 Installation

### Prérequis

- Node.js 
- PostgreSQL 
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/feebdack.git
cd feebdack
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/feebdack"

# NextAuth
NEXTAUTH_SECRET="votre-secret-aleatoire"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialiser la base de données**
```bash
npx prisma migrate dev
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🎯 Utilisation

### 1. Créer un compte

Rendez-vous sur `/register` et créez votre compte.

### 2. Ajouter un site

Dans le dashboard, cliquez sur le bouton `+` dans la sidebar pour ajouter un nouveau projet.

### 3. Intégrer le widget

Copiez le script d'intégration depuis les paramètres du site :

```html
<script src="http://localhost:3000/widget.js" data-site-key="votre-cle-unique"></script>
```

Ajoutez-le juste avant la balise `</body>` de votre site web.

### 4. Recevoir des feedbacks

Vos utilisateurs peuvent maintenant cliquer sur le widget flottant pour laisser leurs retours !

---

## 👨‍💻 Auteur

**Amine Ben Neji**

[aminebneji.github.io](https://aminebneji.github.io/ReactCv2k25)

---

<div align="center">
  <p>Fait avec ❤️ </p>
</div>
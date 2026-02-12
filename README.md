# 📚 Gestion des Notes - Application Web

Application web moderne de gestion de notes scolaires pour enseignants d'école.

## 🎯 Objectif

Cette application transforme le système Excel traditionnel de gestion de notes en une application web ergonomique et fonctionnelle.

## ✨ Fonctionnalités

### 1. Gestion des données
- ✅ Créer/modifier/supprimer des élèves
- ✅ Créer/modifier/supprimer des matières
- ✅ Créer/modifier/supprimer des évaluations par matière
- ✅ Saisie des notes facilement (0-10)

### 2. Calculs automatiques
- ✅ Moyennes par matière pour chaque élève
- ✅ Moyennes générales
- ✅ Statistiques de classe (min, max, moyenne)
- ✅ Calcul automatique en temps réel

### 3. Visualisation
- ✅ Code couleur intelligent :
  - 🔴 Rouge : notes < 5/10
  - 🟠 Orange : notes 5-7/10
  - 🟢 Vert : notes > 7/10
  - 🟡 Jaune : excellentes notes > 8.5/10
- ✅ Tableau principal avec toutes les notes
- ✅ Dashboard avec statistiques générales

### 4. Import/Export
- ✅ Exporter en PDF (format bulletin)
- ✅ Exporter en Excel (CSV)
- ✅ Backup/Restore en JSON
- ✅ Sauvegarde automatique locale (localStorage)

### 5. Interface utilisateur
- ✅ Design moderne et responsive
- ✅ Interface en français
- ✅ Navigation intuitive
- ✅ Messages de confirmation et feedback

### 6. Sécurité & Persistance
- ✅ Sauvegarde automatique (localStorage)
- ✅ Backup manuel en JSON
- ✅ Validation des notes (0-10)

## 🏗️ Architecture

### Technologies utilisées
- **Frontend** : HTML5, CSS3, JavaScript (vanilla)
- **Stockage** : localStorage
- **Librairies** : 
  - jsPDF : export PDF
  - jsPDF-AutoTable : tableaux PDF
  - Chart.js : graphiques (prêt pour extension)

### Structure du projet

```
/
├── index.html              # Application principale
├── css/
│   └── styles.css          # Styles CSS
├── js/
│   ├── app.js              # Logique principale
│   ├── storage.js          # Gestion persistance
│   ├── utils.js            # Fonctions utilitaires
│   └── export.js           # Export PDF/Excel
├── lib/                    # Librairies externes (CDN)
└── README.md              # Documentation
```

## 🚀 Utilisation

### Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur web
2. Ajoutez des élèves avec le bouton "➕ Élève"
3. Ajoutez des matières avec le bouton "➕ Matière"
4. Saisissez les notes directement dans le tableau
5. Les moyennes se calculent automatiquement !

### Guide d'utilisation

#### Ajouter un élève
1. Cliquez sur "➕ Élève"
2. Entrez le nom de l'élève
3. Cliquez sur "Ajouter"

#### Ajouter une matière
1. Cliquez sur "➕ Matière"
2. Entrez le nom de la matière (ex: SCIENCES)
3. Cliquez sur "Ajouter"
4. Par défaut, 4 évaluations (N1, N2, N3, N4) sont créées

#### Saisir des notes
1. Cliquez dans la cellule correspondant à l'élève et à l'évaluation
2. Entrez une note entre 0 et 10
3. La couleur change automatiquement selon la performance
4. Les moyennes se mettent à jour instantanément

#### Modifier/Supprimer
- Pour modifier un élève ou une matière : cliquez sur le bouton ✏️
- Pour supprimer : cliquez sur le bouton 🗑️
- Une confirmation vous sera demandée

#### Export des données

**Export PDF** : Génère un bulletin de notes complet avec toutes les notes et moyennes

**Export Excel** : Génère un fichier CSV compatible Excel avec toutes les données

**Backup JSON** : Sauvegarde complète des données pour restauration ultérieure

#### Import des données

**Import Excel** : Importe des élèves depuis un fichier CSV (format: Classe;Nom)

**Restore JSON** : Restaure une sauvegarde précédente

## 🎨 Code couleur des notes

L'application utilise un code couleur pour une visualisation rapide :

| Couleur | Emoji | Plage | Signification |
|---------|-------|-------|---------------|
| 🟡 Jaune | 🟡 | > 8.5 | Excellent |
| 🟢 Vert | 🟢 | 7-8.5 | Bien |
| 🟠 Orange | 🟠 | 5-7 | Moyen |
| 🔴 Rouge | 🔴 | < 5 | À améliorer |

## 💾 Sauvegarde des données

### Automatique
- Les données sont automatiquement sauvegardées dans le localStorage du navigateur
- Une sauvegarde automatique a lieu toutes les 30 secondes
- Aucune connexion internet requise

### Manuelle
- Utilisez "💾 Backup JSON" pour exporter vos données
- Conservez ce fichier en lieu sûr
- Utilisez "🔄 Restore JSON" pour restaurer vos données

## 📱 Responsive Design

L'application est optimisée pour :
- 💻 Ordinateurs de bureau
- 💻 Ordinateurs portables
- 📱 Tablettes
- 📱 Smartphones

## ⚠️ Notes importantes

1. **Navigateur web moderne requis** : Chrome, Firefox, Safari, Edge (versions récentes)
2. **localStorage activé** : Nécessaire pour la sauvegarde automatique
3. **Cookies** : L'application n'utilise pas de cookies
4. **Confidentialité** : Toutes les données restent dans votre navigateur

## 🔒 Sécurité

- Les données sont stockées localement dans votre navigateur
- Aucune transmission de données vers un serveur externe
- Sauvegardez régulièrement vos données avec le système de backup

## 🆘 Dépannage

### Les données ne se sauvegardent pas
- Vérifiez que le localStorage est activé dans votre navigateur
- Vérifiez que vous n'êtes pas en mode navigation privée
- Essayez un autre navigateur

### Le PDF ne se génère pas
- Vérifiez votre connexion internet (nécessaire pour charger jsPDF via CDN)
- Vérifiez que les pop-ups ne sont pas bloquées
- Essayez avec un autre navigateur

### L'affichage est incorrect
- Videz le cache de votre navigateur
- Rechargez la page (Ctrl+F5 ou Cmd+R)
- Vérifiez que JavaScript est activé

## 🚀 Fonctionnalités futures possibles

- [ ] Graphiques de progression par élève
- [ ] Export en format bulletin PDF personnalisé
- [ ] Import/Export Excel avancé
- [ ] Gestion de plusieurs classes
- [ ] Accès parents (avec authentification)
- [ ] Synchronisation cloud
- [ ] Commentaires sur les notes
- [ ] Calcul de moyennes pondérées

## 📄 Licence

Ce projet est open source et libre d'utilisation pour les établissements scolaires.

## 👨‍💻 Support

Pour toute question ou problème, veuillez créer une issue sur le repository GitHub.

---

**Fait avec ❤️ pour les enseignants**

# Exercice 2 — Types d’architecture et architecture N-tiers

**Durée :** 45 minutes · **Organisation :** en binômes · **Travail :** sans coder

L’objectif est de :

- distinguer une architecture monolithique d’une architecture en microservices ;
- distinguer le modèle client-serveur du modèle pair-à-pair (Peer-to-Peer ou P2P) ;
- répartir les responsabilités entre présentation, logique métier et données ;
- distinguer les couches logiques des tiers de déploiement et expliquer une architecture à trois tiers.

## Contexte

Le Foodtruck de l’exercice 1 souhaite proposer un site permettant aux clients de consulter les pizzas et de passer commande. Le pizzaïolo doit pouvoir modifier la carte et suivre les commandes.

Vous devez analyser plusieurs organisations possibles du système, puis proposer une architecture adaptée. Aucun code n’est demandé. Vous pouvez consulter les ressources en fin d’énoncé.

Pour cet exercice :

- **monolithe / microservices** décrit le découpage et le déploiement de l’application métier ;
- **client-serveur / pair-à-pair** décrit les rôles des participants dans les échanges étudiés ;
- une **couche** regroupe des responsabilités logiques ; un **tiers** correspond à leur déploiement sur une infrastructure séparée ;
- plusieurs couches peuvent partager un même tiers ; plusieurs machines qui exécutent le même rôle peuvent appartenir au même tiers ;
- les situations de la partie 1 sont indépendantes ; les parties 2 et 3 concernent le Foodtruck.

## 1. Reconnaître les architectures — 10 minutes

### 1.1. Monolithe ou microservices ?

Pour chaque situation, identifiez l’architecture de l’application métier et justifiez votre réponse par un indice précis de l’énoncé.

| N° | Situation                                                                                                                                                                           | Monolithe ou microservices ? | Justification                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| 1   | Le catalogue, les commandes et les paiements sont des modules d’une seule application. Ils sont livrés ensemble dans un même programme serveur.                                  | monolithe                    | "Une seule application", "livrés ensemble"                                   |
| 2   | Le catalogue, les commandes et les paiements sont des services autonomes. Chaque service est déployable séparément, communique par une API et gère ses propres données.        | microservices                | "... sont des services autonomes", "déployable séparément"                 |
| 3   | Pour accueillir davantage de clients, on lance quatre copies identiques du programme de la situation 1 derrière un répartiteur de charge. Chaque copie contient tous les modules. | monolithe (4 fois)           | Les applications ne communiquent pas entre eux. Seule la charge est répartie |

### 1.2. Client-serveur ou pair-à-pair ?

Identifiez le modèle des échanges décrits. Précisez qui demande et qui fournit les données. Si plusieurs modèles coexistent, indiquez lesquels et pour quels échanges.

| N° | Situation                                                                                                                                                                   | Modèle des échanges | Rôles des participants                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| 4   | Les tablettes des clients demandent la carte au serveur du Foodtruck. Elles ne fournissent aucune donnée aux autres tablettes.                                             | Client-serveur        | client : tablette / demande une ressource, serveur : serveur / répond et renvoit      |
| 5   | Des ordinateurs s’échangent directement des morceaux d’un fichier. Chacun peut télécharger des morceaux et transmettre ceux qu’il possède déjà.                    | P2P                   | ordinateurs : téléchargement et transmission                                         |
| 6   | Un serveur central fournit une liste d’ordinateurs possédant un fichier. Les ordinateurs utilisent ensuite cette liste pour échanger directement les morceaux entre eux. | Client-serveur et P2P | serveur : transmet une liste / ordinateurs : demande cette liste + échanges entre eux |

## 2. Concevoir une architecture à trois tiers — 15 minutes

Le Foodtruck retient le déploiement suivant :

- **A :** le navigateur du client, qui affiche l’interface et exécute le code de présentation ;
- **B :** une machine virtuelle qui exécute une API regroupant tout le traitement métier dans une seule application déployable ;
- **C :** une autre machine virtuelle qui exécute le système de gestion de base de données.

Le navigateur communique uniquement avec l’API, en HTTPS. L’API envoie des requêtes SQL à la base par le protocole réseau du système de gestion de base de données choisi. Le navigateur n’accède jamais directement à la base de données. On ne représente pas le téléchargement initial des fichiers de l’interface.

### 2.1. Répartir les responsabilités

#### a. Associer les couches à leur emplacement

Associez chaque couche à son emplacement (**A**, **B** ou **C**) dans le déploiement décrit ci-dessus.

| Couche          | Emplacement |
| --------------- | ----------- |
| Présentation   | A           |
| Logique métier | B           |
| Données        | C           |

#### b. Associer les responsabilités aux couches

Pour chaque responsabilité, indiquez uniquement la couche concernée : **présentation**, **logique métier** ou **données**.

La vérification du prix relève des règles métier, même si la présentation propose aussi une validation de formulaire.

| N° | Responsabilité                                                               | Couche                                                                              |
| --- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | Afficher la carte des pizzas et le formulaire de commande.                    | A                                                                                   |
| 2   | Afficher le message de confirmation reçu après une commande.                | A                                                                                   |
| 3   | Vérifier qu’un prix de pizza n’est pas négatif selon les règles métier. | B                                                                                   |
| 4   | Calculer le total d’une commande à partir des prix de référence.          | B ( Pourrait être C si existe table commandes avec total automatiquement calculé) |
| 5   | Vérifier que l’utilisateur a le droit de modifier la carte.                 | B                                                                                   |
| 6   | Stocker durablement les pizzas et les commandes.                              | C                                                                                   |
| 7   | Exécuter une requête SQL pour retrouver une commande.                       | C                                                                                   |

#### c. Ajouter une couche au système

La couche métier contient actuellement les règles de commande et le code qui prépare les requêtes SQL. Vous souhaitez isoler ce code pour pouvoir changer de système de base de données en limitant les modifications des règles métier.

1. Proposez un nom pour cette nouvelle couche.

Couche de persistance / Accès au donnée

1. Donnez deux responsabilités de cette couche et une responsabilité qui doit rester dans la couche métier.

- Construire et executer les requêtes SQL
- Gérer la connexion à la base
- Vérifier les règles

1. Dessinez un schéma des **quatre couches**, avec des flèches indiquant le sens des appels.



**Réponse :**

Couche présentation -> Couche métier -> Couche accès aux données -> Base de données

Cette variante concerne uniquement la question c. La suite reprend l’architecture initiale à trois couches.

### 2.2. Représenter les échanges

Dessinez le schéma des trois tiers en Mermaid ou dans un bloc de texte Markdown. Indiquez :

1. le nom de chaque tiers et son emplacement ;
2. les liens autorisés, avec les protocoles ;
3. les flèches des demandes et des réponses.

Décrivez ensuite en **quatre à six étapes** le parcours d’une commande, depuis le clic sur « Commander » jusqu’à l’affichage de la confirmation. Le serveur doit valider la commande et calculer son total avant de l’enregistrer.

**Schéma et étapes :**

Tiers présentation / Utilisateur | --> Demande: HTTPS, POST /api/commandes | <-- Réponse : HTTPS, 201 Created | Tiers application / serveur | --> Demande : SQL, SELECT-INSERT | <-- Réponse : Résultat SQL | Tiers Données / Serveur Base de Donnée

1. L'utilisateur clique sur Commander. Le navigateur envoit une requête POST avec toutes les informations (JSON) que le JS aura récolté
2. Le serveur reçoit la requête et vérifie les données
3. Le serveur calcule le total en se référant aux prix se trouvant dans la BD
4. Le serveur envoit une requête d'écriture à la BD, qui répond l'id si tout s'est bien passé
5. Le serveur renvoie 201 Created avec un JSON (par exemple id: 1, total: 12)
6. Le navigateur reçoit la réponse et affiche le succès + le total

### 2.3. Distinguer couches et tiers

On considère une application qui conserve les mêmes trois couches logiques : présentation, logique métier et données. Pour chaque déploiement ci-dessous, indiquez le nombre de tiers selon les conventions de l’exercice.

| Déploiement                                                                                                                                                         | Nombre de tiers | Justification                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Une application locale affiche l’interface, effectue les calculs et utilise une base embarquée sur le même poste, sans autre machine.                             | 1               | Tout s'éxecute sur une seule machine. Aucune communication réseau entre les couches                                               |
| Une application de bureau affiche l’interface et exécute la logique métier sur le poste utilisateur. Elle accède directement à une base sur un serveur distant. | 2               | Le poste utilisateur possède l'interface + la logique métier. Un serveur distant possède les données                            |
| Le navigateur assure la présentation, une machine virtuelle exécute l’API métier et une autre machine virtuelle héberge la base, comme dans le Foodtruck.       | 3               | Chaque couche se trouve sur un emplacement distinct. Le navigateur ne communique qu'avec la VM et la BD ne communique qu'avec la VM |

## 3. Justifier un choix d’architecture — 10 minutes

Répondez en deux ou trois phrases par question en vous appuyant sur les contraintes données.

### 3.1. Démarrer avec une petite équipe

Deux développeurs réalisent le site du Foodtruck. Le trafic est faible, les fonctionnalités sont simples et les mises à jour peuvent être livrées ensemble. L’équipe dispose de peu de temps pour gérer l’infrastructure.

Choisiriez-vous un monolithe ou des microservices pour l’API métier ? Donnez un avantage et une limite de votre choix.

**Réponse :**

Monolithe. Structure la plus simple à écrire au début et peu de traffic. Scallabilité plus compliquée

### 3.2. Faire évoluer la plateforme

Le Foodtruck devient une plateforme pour 200 restaurants. Trois équipes gèrent respectivement le catalogue, les commandes et les paiements. Elles doivent publier leurs évolutions séparément. Les paiements nécessitent davantage de capacité à certaines heures. L’organisation dispose désormais d’une équipe d’exploitation.

Quel découpage proposeriez-vous ? Donnez un bénéfice lié aux contraintes et une difficulté supplémentaire à gérer.

**Réponse :**

Microservices. Permet l'indépendance des services ( publication séparées, 3 équipes qui travaillent sur des services différents)

### 3.3. Combiner les notions

Dans le déploiement de la partie 2, l’API métier est-elle monolithique ou composée de microservices ? Quel est le modèle des échanges entre le navigateur et l’API ? Combien de tiers sont représentés ? Expliquez pourquoi ces réponses sont compatibles.

**Réponse :**

Monolithe, client-serveur, 3

## 4. Vrai ou faux : vérifier une architecture — 10 minutes

Indiquez **Vrai** ou **Faux**. Corrigez chaque proposition fausse.

| N° | Proposition                                                                                                                   | Vrai ou faux ? | Correction si faux                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------- |
| 1   | Une application qui possède trois couches logiques est forcément déployée sur trois tiers.                                | Faux           | Pourrait tout être écrit sur un seul tiers / serveur ( Monolithe) |
| 2   | Une API métier monolithique peut participer à une architecture à trois tiers.                                              | Vrai           |                                                                     |
| 3   | Exécuter plusieurs copies identiques d’un monolithe transforme automatiquement l’application en microservices.             | Faux           | Micro-services = Services qui communiquent entre eux.               |
| 4   | Dans un échange pair-à-pair, un même participant peut demander des données et en fournir.                                 | Vrai           |                                                                     |
| 5   | Si un serveur aide les participants à se découvrir, les transferts de fichiers entre eux ne peuvent pas être pair-à-pair. | Faux           | On peut combiner P2P et client-serveur                              |
| 6   | Dans l’architecture du Foodtruck de la partie 2, le navigateur peut contourner l’API et modifier directement la base.       | Faux           | Le navigateur ne peut que communiquer avec le serveur               |
| 7   | Les microservices suppriment les problèmes de panne réseau entre les composants.                                            | Faux           | Les composants communiquent justement par le réseau                |
| 8   | Une architecture N-tiers comporte obligatoirement exactement trois tiers.                                                     | Faux           | 2-tiers, 4-tiers, ...                                               |

## Livrable

Placez le fichier `exercice-2.md` dans un dossier `exercice/` à la racine de votre dépôt.

## Ressources

- [AWS — Monolithe et microservices](https://aws.amazon.com/compare/the-difference-between-monolithic-and-microservices-architecture/)
- [Microsoft Learn — Architecture en microservices](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices)
- [MDN — La relation client-serveur](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)
- [RFC 5694 — Architectures pair-à-pair, sections 2 et 3 (anglais)](https://www.rfc-editor.org/rfc/rfc5694)
- [IBM — Architecture à trois tiers (anglais)](https://www.ibm.com/think/topics/three-tier-architecture)
- [Microsoft Learn — Architecture N-tiers (anglais)](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier)

# AuptiMétro

## Équipe

| Nom | Rôle |
| --- | --- |
| Jude Aybalen | Chef de projet + Traitement de données |
| Emma Duvernet | Frontend |
| Maëlys de Crouy Channel | Fullstack |
| Thomas Bieth-Legout | Fullstack |
| Guillaume Bernard | Backend |

## Description

AuptiMétro est une application web permettant de rechercher des itinéraires dans le réseau de transport francilien.

L’application modélise le réseau sous forme de graphe : les stations sont représentées par des sommets, et les connexions entre stations par des arêtes. À partir de ce graphe, l’utilisateur peut rechercher un trajet entre deux stations selon plusieurs critères :

- le temps de trajet ;
- les émissions de CO₂.

L’application permet aussi :

- d’afficher le trajet sur une carte ;
- de consulter les alertes trafic ;
- de visualiser différentes représentations du graphe ;
- de tester la connectivité du réseau.

## Prérequis

Avant de lancer l’application, il faut avoir :

- Java JDK 24 ;
- Git ;
- un navigateur web récent, par exemple Chrome, Firefox ou Edge ;
- une connexion internet pour l’affichage de la carte et les alertes réseau.

Le projet utilise Maven Wrapper. Il n’est donc pas nécessaire d’installer Maven séparément.

## Installation

Cloner le dépôt GitHub :

```bash
git clone https://github.com/Maitret17/AuptiMetro.git 
```

Se placer dans le dossier du projet :

```bash
cd Optimetro
```

## Lancer le backend

Depuis la racine du projet, lancer le serveur Spring Boot.

Sur Windows :

```powershell
.\mvnw.cmd spring-boot:run
```

Sur Linux ou macOS :

```bash
./mvnw spring-boot:run
```

Par défaut, le backend est disponible à l’adresse suivante :

```text
http://localhost:8080
```

Le backend doit rester lancé pendant l’utilisation de l’application.

### Si le port 8080 est déjà utilisé

Il est possible qu’un autre programme utilise déjà le port `8080`. Dans ce cas, le backend peut échouer au lancement avec une erreur indiquant que le port est déjà occupé.

Il faut alors soit fermer le programme qui utilise ce port, soit modifier le port utilisé par Spring Boot dans le fichier suivant :

```text
src/main/resources/application.properties
```

Exemple :

```properties
server.port=8081
```

Le backend sera alors disponible à l’adresse suivante :

```text
http://localhost:8081
```

Attention : si le port est modifié, les appels API dans les fichiers JavaScript devront aussi utiliser le nouveau port.

## Lancer le frontend

Ouvrir le fichier suivant dans un navigateur :

```text
frontend/html/itineraire.html
```

Les autres pages sont accessibles depuis le bandeau de navigation :

- Itinéraire ;
- Alerte réseau ;
- Graphe.

## Utiliser la page Itinéraire

La page Itinéraire permet de rechercher un trajet entre deux stations.

### Étapes d’utilisation

1. Saisir une station de départ dans le champ `Départ`.
2. Saisir une station d’arrivée dans le champ `Arrivée`.
3. Choisir le critère d’optimisation :
    - `Temps` pour rechercher le trajet le plus rapide ;
    - `Moins polluant` pour rechercher le trajet avec le moins d’émissions de CO₂.
4. Cliquer sur `Calculer le trajet optimal`.

### Résultat affiché

Après le calcul, l’application affiche :

- la durée estimée du trajet ;
- les émissions de CO₂ ;
- le nombre de stations ;
- le nombre de correspondances ;
- les lignes empruntées ;
- le détail du trajet station par station ;
- le tracé du trajet sur la carte.

Les lignes sont affichées avec leur couleur correspondante.

## Utiliser la carte

La carte affiche le trajet calculé à partir des coordonnées des stations.

Chaque station du trajet est représentée par un point. Le tracé relie les stations dans l’ordre du trajet.

Le tracé ne suit pas exactement les rails ou les tunnels : il relie les stations entre elles à partir de leurs coordonnées géographiques.

## Utiliser la page Alerte réseau

La page Alerte réseau affiche les perturbations du réseau à partir de l’API PRIM / Île-de-France Mobilités.

L’utilisateur peut filtrer les alertes par mode de transport :

- Tous ;
- Métro ;
- RER ;
- Tramway.

Le bouton `Actualiser` permet de recharger les données.

## Utiliser la page Graphe

La page Graphe permet de visualiser plusieurs représentations du réseau :

- le graphe complet ;
- le graphe géographique ;
- l’ACPM basé sur le temps ;
- l’ACPM basé sur les émissions de CO₂.

Les graphes SVG peuvent être zoomés et déplacés.

## Tester la connectivité du graphe

Sur la page Graphe, un bouton permet de tester si toutes les stations sont atteignables dans le graphe.

Cliquer sur :

```text
Tester la connectivité
```

L’application affiche ensuite le résultat, par exemple :

```text
Graphe connecté : 1270/1270 stations atteignables.
```

## Données utilisées

Les données principales sont stockées dans :

```text
src/main/resources/data/
```

Les fichiers utilisés sont notamment :

```text
station_node.csv
edges.csv
```

`station_node.csv` contient les stations, les lignes et les coordonnées.

`edges.csv` contient les connexions entre stations, avec le temps, la distance et les émissions de CO₂.

## Problèmes possibles

### Le trajet ne se calcule pas

Vérifier que :

- le backend Spring Boot est bien lancé ;
- l’adresse `http://localhost:8080` est accessible ;
- les stations choisies viennent bien de la liste proposée ;
- les fichiers CSV sont présents dans `src/main/resources/data`.

### La carte ne s’affiche pas

Vérifier la connexion internet. La carte utilise des ressources externes.

### Les alertes réseau ne se chargent pas

Vérifier que :

- la connexion internet fonctionne ;
- la clé API PRIM est valide ;
- le quota de requêtes n’est pas dépassé.

## Technologies utilisées

- Java 24
- Spring Boot
- Maven Wrapper
- HTML
- CSS
- JavaScript
- Leaflet
- svg-pan-zoom

## Objectif du projet

L’objectif du projet est de modéliser un réseau de transport sous forme de graphe afin de calculer, comparer et visualiser des itinéraires optimisés selon plusieurs critères.

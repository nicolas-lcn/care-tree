# CareTree

Ceci est une application web réalisée dans le cadre d'un projet étudiant.
<br>
Elle a été développée par Cody CLOP et Nicolas LUCIANI. 

L’objectif de ce projet est de rendre le monde meilleur en créant une chaîne de bonnes actions.
<br>
Lorsqu’un utilisateur se connecte, il a accès à une liste de défis plus ou moins difficiles, tous ayant un impact positif sur le monde, qu’il peut accepter.
<br>
Exemples de défi : donner son sang, complimenter un inconnu, participer à un téléthon…
<br>
Un défi est créé par un utilisateur et peut être accepté par plusieurs utilisateurs. Il a une valeur en fonction du nombre d’upvotes qu’il reçoit. 
<br>
Lorsqu’il est accompli par un utilisateur, ce dernier reçoit un nombre de points équivalent à cette valeur.  
<br>
L’utilisateur peut consulter son « arbre », qui grandit en fonction du nombre de points dont il dispose.
<br>
Un défi peut également être signalé s’il est jugé inadéquat par un utilisateur. Lorsqu’un administrateur se connecte, il a accès à une liste de tous les défis signalés, qu’il peut donc supprimer ou rétablir.
<br>

## Le site

### Partie utilisateur non connecté
En tant qu’utilisateur non connecté, les seules possibilités sont d’avoir une présentation du site, et des challenges. En effet, il est important qu’un utilisateur puisse avoir un aperçu de ce qu’il est possible de faire en s’inscrivant ou se connectant. Ainsi, on peut donc voir les challenges et les challenges aléatoires. Pour autant, il est impossible de les signaler, de les relever ou de les aimer. <br>
Aussi, un utilisateur non connecté pourra consulter la page de contact, car cette page se doit d’être accessible à tous. Dans l’en-tête de la page, un utilisateur non connecté trouvera donc deux boutons permettant de se connecter ou de s’inscrire. Ses boutons renvoient respectivement vers deux pages contenant des formulaires de connexion et d’inscription. 

### Partie utilisateur connecté
Un utilisateur a plusieurs avantages à être connecté. <br>
Pour pouvoir relever un défi, action au cœur de notre site, il faut être connecté. Ainsi, une fois le défi relevé, ce dernier se trouve maintenant dans la section défi accepté de l’utilisateur. De la même manière, une fois connecté, un utilisateur a accès aux défis qu’il a terminé, et aux défis qu’il a créés. Voilà donc une fonctionnalité tout aussi importante que d’accepter des challenges : les créer. Seul un utilisateur connecté peut créer un défi pour la communauté. Sur la page de création, un formulaire sera proposé afin d’insérer de nouvelles données dans la base de données des Défis. <br>
Un titre est obligatoire, contrairement à la description. Ainsi, lorsqu’on consulte la page des challenges, on peut donc voir le titre du challenge, et son auteur. <br>
	Aussi, un utilisateur connecté peut consulter “son arbre”. L’évolution de l’arbre dépend du nombre de points que possède l’utilisateur, Plus un défi est liké, plus il rapportera de points. L’idée, en tant qu'utilisateur, est de voir grandir son arbre au gré des actes positifs réalisés, et que cela fonctionne comme une récompense. <br>
	Enfin, un utilisateur connecté peut modifier ses informations, telles que son mot de passe ou bien sa photo de profil. Il peut aussi récupérer les données que le site conserve depuis la page de contact. 
	3 - Partie administrateur
Un administrateur a accès à une autre version de la page des challenges. En effet, un administrateur a le pouvoir de fermer un challenge. Fermer un challenge est une action irréversible. Aussi, lorsque le nombre de signalements d’un défi atteint trois; il disparaît de la page classique des challenges et apparaît sur la page des défis suspendus accessible uniquement en tant qu'administrateur. Sur cette page, un administrateur pourra choisir de fermer ou d’ouvrir à nouveau un défi suspendu.  

## Spécificités techniques

### Base de données
 

Les différents états d’un défi :
‘OPEN’ : le défi peut être accepté par les utilisateurs
‘REPORTED’ : le défi est suspendu puis soumis à un administrateur qui peut juger de sa suppression ou non
‘CLOSED’ : le défi a été jugé inapproprié par un administrateur

Cette base de données est gérée avec SQLite3. Le fichier create-db.js permet de créer la structure de la base de données ainsi que de l’initialiser avec des valeurs donnant un aperçu de l’application.
Le fichier model.js permet d'interagir avec cette base de données. 

### Serveur
#### Modules
<ul>
<li> express </li>
<li>mustache-express </li>
<li>cookie-session</li>
<li>express-validator</li>
<li>body-parser</li>
</ul>

#### Middlewares
  <ul>
    <li>is_authenticated permet de savoir si un utilisateur est connecté</li>
    <li> is_admin permet de savoir si l’utilisateur est un admin </li>
  </ul>
Un cookie session est utilisé. Ses clés name et avatar contiennent le pseudonyme ainsi que l’URL de l’avatar de l’utilisateur s’il est connecté. Sa clé isAdmin vaut true si l’utilisateur est un administrateur. Enfin la clé accept vaut true si l’utilisateur a accepté les cookies, cela afin d’éviter de demander plusieurs fois l’accord de l’utilisateur.
La variable globale NB_MAX_REPORTS est le nombre de signalements nécessaires pour qu’un défi soit suspendu
Il y a en plus de ces éléments de nombreuses fonctions pour afficher et modifier les données, qui ne seront pas détaillées ici.

### JavaScript côté client
En plus du JavaScript exécuté par Bootstrap, la fonction clicked est appelée lors du click sur le bouton upvote dans les vues challenges, createdChallenges, randomChallenge et succeededChallenges. Cette fonction modifie l’icône d’upvote et fait une requête AJAX afin de mettre à jour la base de données. Cela permet de pouvoir aimer un défi sans recharger la page.

### Vue
Pour implémenter les différentes vues du site, nous avons utilisé le framework Bootstrap 5. En nous inspirant des modèles disponibles sur la documentation du framework, et grâce aux différentes classes css qu’il propose, la création des différentes pages du sites a été grandement simplifiée. Nous avons également utilisé le moteur de template mustache. 
<br>
Ceci nous a permis en grande partie d’implémenter un en-tête et un pied de page, présent sur chaque vue, sans recopier le code. Aussi, nous avons utilisé font-awesome pour importer des icônes. Passons en revue les différentes pages de notre site : <br>
Pour les vues concernant les challenges on aura : <br>

<ul>
<li> Une vision générale des challenges <br>
  views/challenges.html </li>
<li> Un challenge aléatoire <br>
  views/randomChallenges.html </li>
<li> Les challenges créés <br>
  views/createdChallenges.html </li>
<li> Les challenges acceptés <br>
  views/acceptedChallenges.html </li>
<li> Les challenges terminés <br>
  views/succeededChallenges.html </li>
<li>	Une page de création de challenge contenant le formulaire de création <br>
views/createChallenges.html </li>
<li> Pour l'administrateur, une vue des challenges suspendus <br>
  views/suspendedChallenges.html </li>
  </ul>
Ensuite, certaines des pages sont concentrées autour d’un formulaire visant à mettre à jour la base de données utilisateurs : 
<ul>
  <li> Formulaire d’inscription </li>
  <li> Formulaire de connexion </li>
  <li> Formulaires d’édition de profil </li>
 </ul>
Dans les formulaires d'inscription et d’édition, il est possible de choisir une photo de profil. Chacune d’entre elles est stockée sur le serveur, dans les “assets”. Toutes sont des images libres de droit, qui ont au départ pour but d’être utilisées dans des jeux vidéos, pour représenter différents personnages d’un jeu de rôle. Le nom donné aux personnages est un choix personnel. <br>
Aussi, on trouvera la page de consultation de l’arbre. Sur celle-ci, on trouvera aussi des images stockées dans les "assets", qui sont des créations personnelles. On trouvera sur cette page un récapitulatif des points que possède un utilisateur, et sa progression par rapport à la taille de son arbre. <br>
En fonction de l’état de connexion d’un utilisateur (administrateur, utilisateur connecté ou non), l’en-tête de la page va être modifié, donnant accès ou non aux différentes vues citées ci-dessus. En tant qu’utilisateur connecté, l’en-tête contient un lien vers : <br>
<ul>
  <li>l’accueil du site </li>
  <li> la page des challenges </li>
  <li>un défi aléatoire </li>
<li>la page de consultation de son arbre </li>
<li>un menu déroulant lui permettant d’accéder aux différentes pages de défis (créés, terminés, acceptés), de se déconnecter ou de mettre à jour son profil. </li>
  </ul>
En tant qu’administrateur, l’en-tête contient un lien vers : 
<ul>
<li>l’accueil du site </li>
<li>la page des challenges </li>
<li>la page des défis suspendus </li>
<li>un bouton pour se déconnecter </li>
  </ul>
Enfin, le pied de page ne diffère pas comme l'en-tête, et contient un lien vers la page de contact. Sur cette page, se trouve tout ce qu’il est important d’avoir pour respecter la RGPD dont nous discuterons plus tard, ainsi qu’une brève description du projet. <br>
Pour chacune des pages, le serveur y associe une route GET, avec le middleware is-authenticated ou is_admin en fonction des limites d'accessibilité que nous avons décidé de donner à la page. 

## Respect RGPD
Concernant la RGPD, la plupart de nos actions se trouvent sur la page de contact. 
<br>
Pour autant, on trouvera dès l’arrivée sur le site, une alerte avertissant de l’utilisation de cookies nécessaires. Tous les mots de passe des utilisateurs sont cryptés dans la base de données grâce à la fonction de hachage bcrypt. Aussi, on trouvera sur la page d’édition du profil, un bouton permettant de supprimer le compte. 
<br>
Comme nous basons le calcul des points sur le nombre de défis terminés, il est impensable que la suppression d’un compte implique la suppression des défis créés par son propriétaire et donc la perte de points chez les autres utilisateurs les ayant terminés. <br> 
Ainsi, nous avons décidé d’anonymiser tout ce qui pourrait identifier le propriétaire, et de supprimer ensuite ses données (son nom d’utilisateur, mot de passe, défis). Cela permet donc que la suppression d’un compte n’affecte pas les autres utilisateurs. <br>
Enfin, on a donc sur la page de contact un lien vers une adresse de courrier électronique permettant de nous contacter pour des demandes spécifiques. De plus, il y a un bouton vers le lien de la page de récupération des données utilisateurs. Depuis cette page il est possible de consulter toutes les données qui sont reliées au compte d’un utilisateur, sous forme brute (json) ou non.


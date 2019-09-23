# Introduction

## Kata

Un kata de code est un exercice de programmation qui permet aux programmeuses et aux programmeurs de perfectionner leurs compétences à travers la pratique et la répétition. Le terme a probablement été inventé par Dave Thomas, co-auteur du livre The Pragmatic Programmer, s'appuyant sur une métaphore du concept japonais de kata dans les arts martiaux. En octobre 2011, Dave Thomas a publié sur son site une compilation de 21 katas.

_Source: https://fr.wikipedia.org/wiki/Kata_(programmation)\_

## Démineur

Le champ de mines est représenté par une grille en deux dimensions, avec un pavage rectangulaire.

Chaque case de la grille peut soit cacher une mine, soit être vide. Le but du jeu est de découvrir toutes les cases libres sans faire exploser les mines, c'est-à-dire sans cliquer sur les cases qui les dissimulent.

Lorsque le joueur clique sur une case libre comportant au moins une mine dans l'une de ses cases avoisinantes, un chiffre apparaît, indiquant ce nombre de mines. Si en revanche toutes les cases adjacentes sont vides, une case vide est affichée et la même opération est répétée sur ces cases, et ce jusqu'à ce que la zone vide soit entièrement délimitée par des chiffres. En comparant les différentes informations récoltées, le joueur peut ainsi progresser dans le déminage du terrain. S'il se trompe et clique sur une mine, il a perdu.

On peut signaler les cases contenant des mines présumées par un drapeau en cliquant sur le bouton droit de la souris — mais ce n'est aucunement obligatoire. Il faut faire attention à ne pas signaler une case saine par un drapeau, car cela peut induire en erreur ; ce n'est toutefois pas aussi pénalisant que de découvrir une mine.

# Historique du projet

Le projet a été commencé par un développeur Java pour s'essayer au TypeScript. Il a déjà créé quelques objets mais n'a pas encore réfléchi à l'interface utilisateur.

# Objectif

En repartant de cette base, créez votre version du jeu.

-   il n'y a pas de limite de temps,
-   tout comportement doit être testé
-   une stack webpack-dev-server/typescript/react est pré-installé, mais vous pouvez, si vous le souhaitez, utiliser celle de votre choix.

# Installation

`make install`

`make start`

# Tests

`make test`

# Challenges

### Facile

0. Améliorez visuellement le plateau de jeu.

1. Les conditions de victoire sont fausses, corrigez-les ainsi que les tests associés.

### Medium

2. Lors d'un clic sur une case, affichez le nombre de mines adjacentes sur la grille.

3. Pour faciliter la vie du joueur, on veut faire en sorte qu'un clic sur une case vide dévoile la zone l'entourant, jusqu'à ce que toutes les cases limitrophes de la zone soient adjacentes à au moins une mine et comportent un numéro.

![screenshot](https://cl.ly/92c9c05eeaeb/Screenshot_2019-04-25%252520demineur%252520-%252520Recherche%252520Google.png)

### Hardcore

4. Très sympa ce jeu, mais ce serait encore mieux si l'on pouvait annuler la dernière action.

5. Après quelques parties vous vous apercevez que sans un calcul du score, vous n'avez aucune idée de votre progression. Vous décidez alors de déterminer le score selon les règles suivantes :
    - le score ne peut être supérieur au nombre de cases
    - le score ne peut être inférieur à zero
    - le score de départ est égal au score maximum
    - le retour en arrière diminue le score de 5 points
    - chaque drapeau utilisé diminue le score de 1 point
    - chaque seconde passée diminue le score de 0.2 point

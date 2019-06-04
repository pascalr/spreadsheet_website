THIS IS A BIG WORK IN PROGRESS.
I HAVE MADE THIS PUBLIC IN ORDER TO USE GITHUB PAGES,
BUT THIS IS REALLY NOT READY TO BE PUBLIC YET.

v1 is Firebase only and need to be online
should work on github pages

withPersist => subscribes and loads
withCached => subscribes only
avec => deprecated, use withPersist and withCache, renverser l'ordre des arguments:
withCache(Comp, blah blah)
withPersist(Comp, blah blah)

Me concentrer sur la partie table. Ce n'est pas encore claire ce que je veux comme desktop.

There are 3 levels of formulas: 
The raw with ids
The clean formula
The evaluated value

Ne plus utiliser Preview. Utiliser des sub-tables. Rajouter des sous-tables flotantes.
Apres tu peux clicker et zoomer dessus.

En plus des bookmarks, pouvoir prendre des screenshots comme reminder de qqchose.

Prendre en notes plein de charte pour moi comme ca:
https://www.boltdepot.com/fastener-information/bolts/us-bolt-head-size.aspx

----------------------------------------------------------
Objectifs fin de semaine: Minimum viable product
- Faire une petite demo belle
- Editer et voir le result a cote en temps reel.
- Print pdf et publish html
- Plus de bug grave
- Copier coller en JSON
- Pouvoir envoyer un lien vers mon application
- historique
- ctrl+z
- etre sur de ne pas perdre d'information
- etre capable de tout retrouver (recherche???)
----------------------------------------------------------

https://ytmp3.cc/

Ne plus utiliser click droit. Au lieu, selectionner, et lorsque l'item est selectionner,
faire apparaitre des petites icones d'actions au dessus.
TODO: Enlever tous les menus click droit.
TODO: Pouvoir docker la barre sur les cotes et que ca reste la.

si tu edit un fichier foo.json, mon programme va generer foo.meta.json, qui contient les donnees
a propos de l'affichage.

TODODOODODOODDODO : RENAME preview to previews!!!

The infinite map easier version is a folder and file.
Export as PDF, HTML, JSON, JPEG

TODO: Handle cells values properly, to be able to get the computed value by reference,
not the formula. And run the formula only on onCellsChanged

TODO: Pouvoir programmer mes fonctions a l'interieur de mon app.

TODO: local files, node.js read file

TODO: COPY PASTE A TABLE
TODO: COPY PASTE A TABLE AS JSON, SO COPY PASTE JSON IN ORDER TO ADD FIELDS!!!

Dans le coin en haut a gauche, rajouter un bouton pour faire flipper la table.
Le nom des colonnes deviennet des rangees.

Des trucs semblables (ex: recette) sont base sur un template.
Les templates seraient partager et integre meme a l'application.
Le but etant de pouvoir partager facilement les informations si la meme structure est
utilise.

You can publish as HTML to host on a private website.
You can publish as pdf to distribute and print.

A1 refere a $A$1 comme dans Excel.
Si tu es dans B2 et tu veux referer a A1 relativement c'est (A-1) A-1, A+1, ...
Fuck ca marche pas pour les colonnes...

Ctrl+s en editant une cellule:
Reste en edit mode mais sauvegarde la valeur de la cellule.
Les cellules qui dependent de celle la sont updater.

Tu peux diviser les cellules. En commancant avec /. La cellule devient une liste. Tu
peux avoir une liste dans une liste dans une liste etc.

Tu peux rajouter des commentaires aussi en commmencant avec #. Ces commentaire ne seront
pas pris en compte lorsque tu les choisis. c pas clair

Pourquoi un site maison?

Peut-importe sur quelle ordinateur que tu te trouves, tu devrais pouvoir l'ouvrir et avoir accès à un espace personnel que tu contrôles. Sans publicité. Sans updates. Tes courriels, tes contacts, tes notes, tes favoris, ton historique, tes fichiers. Toutes tes informations devraient être encryptés et ne devraient jamais sortir de ton réseau lisible. Tu peux choisir de partager ce que tu veux. Tu peux collaborer pour des travaux.

Tu dois être capable d'y avoir accès même sur un ordi public ou sur un ordi d'un ami, un ordi au travail ou à l'école. Ordi public pas yab pour la sécurité...

La communauté open source a fais plein de choses. Mais c'est broche à foin et pas cohérent. Tout réunir.

Présentemment, tu es pris par le provider du service à l'utiliser. Ce n'est pas nécessaire. Il existe plein d'alternatives gratuite. Tout ce que tu devrais avoir à faire est payer pour un serveur que tu utilises pour ton synchroniser et stocker tes fichiers.


La publicité dérange. Les updates qui change les choses de places et brises des compatibilités.

!!!POUVOIR VOIR LE RESULTAT DE LA FORMULE LIVE EN L'EDITANT!!!!
Ca serait nice pour du latex, pour de la notation de musique
Peut-etre que ca integrerais aussi, x = 10, qui afficher 10...


React Datasheet
Ligne 222:
if (hasComponent && (isEditing)) {
enlever hasComponent

Un calendrier serait un [[]] genere par une fonction simple.

vi controls to add:
- j,k,l,; -> deplacement
- y -> copier
- v -> selectionner
- i -> insert
- : -> focus dans la barre de commande

TODO:
- // Inside command is used to print the command: a('https://youtube.com') // youtube
- link to other cells
- petit carré en bas qui copy dans les autres cellules (ou bien, version control vi, une lettre et copier avec le clavier etc.)
- resize columns

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode

FIXME:
- Remove all places where I did map(k,i) => key={i}

https://codepen.io/mihaeltomic/pen/PqxVaq

Feature list:
- Partition de musique
- Avoir un menu customizable avec des icons que je click, que je peux deplacer.
- Voir la liste de mes bookmarks.
- Voir mes todos listes directement dans ma page d'acceuil.
- Avoir une checklist des trucs a faire pour ce projet
- Avoir une db de mes films, mes musiques, (liens youtube, accords, ...)
- Pouvoir inclure des documents LaTeX. Voir: https://stackoverflow.com/questions/3284131/is-there-a-javascript-latex-equation-renderer
- Pouvoir faire des calculs de spreadsheet de base
- Pouvoir faire mes impots, avec une base de donnee locale, incryptée.
- Faire ma liste d'epicerie
- Avoir une liste d'articles interessant avec une petite description:
Ex:
https://www.npr.org/sections/goatsandsoda/2019/03/13/685533353/a-playful-way-to-teach-kids-to-control-their-anger
Les parents inuits eduquent leur enfants sans jamais se facher, lever la voix ou les envoyer dans le coin. Au lieu, ils utilisent le pouvoir des histoires et du jeux. Si tu vas dans la riviere le monstre de la riviere va te prendre, t'emmener au fond de l'eau et d'adopter dans une nouvelle famille. Aussi, ils font rejoue un mauvais comportement a l'enfant lorsque ses emotions sont abaisses et lui posent des questions: Why don't you hit me? Owww, that hurts. Does that mean you don't like me?
- Un calendrier du bonheur: Il faut que j'optimise mon bonheur.
- Conditional rendering: Je peux afficher une cellule de plein de maniere differente:
- Latex
- Partition de musique
- Maths
- Image
- ...
- Une ligne sur deux c'est une partition de piano, l'autre de guitare... etc...
NO FOLDERS: Une grosse map c'est tout! et un search bar!

Dans la barre de controle d'un preview, mettre un background beau, mais qui indique clairement que c'est draggable, que c'est resizable, que c'est clickable.

Idee pas rapport: Dans le but d'aider l'environment, travailler à distance. Mais, pas à la maison. Faire un office space où le monde travail à distance dans le même building. Idéalement 1 aux 2 3 coins de rues, pour être proche des maisons où le monde travail. Ça comblerait le besoin de social du monde, et l'office space pourrait fournir des salles de meeting que tu peux réserver.

FEATURE REQUESTS:

1. Avoir une barre de commande console.
2. Pouvoir avec des controles comme avec vi.
3. Possibilite d'un vrai search bar. Au lieu de juste etre un autocomplete, le search bar te donne live des resultats avec des description pi tout, comme google.
4. Flèche par en bas doit rajouter des cases.

Feature list:
- Partition de musique
- Avoir un menu customizable avec des icons que je click, que je peux deplacer.
- Voir la liste de mes bookmarks.
- Voir mes todos listes directement dans ma page d'acceuil.
- Avoir une checklist des trucs a faire pour ce projet
- Avoir une db de mes films, mes musiques, (liens youtube, accords, ...)
- Pouvoir inclure des documents LaTeX. Voir: https://stackoverflow.com/questions/3284131/is-there-a-javascript-latex-equation-renderer
- Pouvoir faire des calculs de spreadsheet de base
- Pouvoir faire mes impots, avec une base de donnee locale, incryptee.
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

FIXME: Il y a un bug quand il y a un menu provider dans un autre. Pourtant avec ca marchait. je sais pas...

Idealement, meme pas de click gauche...

TODO: Chicken and egg. An egg has a chicken. A chicken has an egg.
Il ne faut pas que mon programme plante, malgre une def circulaire.

TODO: Possibilite d'un vrai search bar. Au lieu de juste etre un autocomplete, le search bar te donne live des resultats avec des description pi tout, comme google.

Une commande est un objet javascript. Tu peux lui rajouter des valeurs a onClick, onDrag, ...

https://drivy.engineering/setting-up-vim-for-react/

Favicon image
Studiohack has the "thorough" approach but heres a short hack:

    Enter the domain name like https://superuser.com/(must end with '/')
    Add favicon.ico to the end
    Press enter (this should be in the URL: https://superuser.com/favicon.ico)
    Right click on the image and click "save image as"

ca serait nice de pouvoir naviguer les elements reacts selon lequel contient lequel

TODO:
(Dans longtemps): Mettre toutes les donnees sous un utilisateur dans firebase.

AVOIR UNE BARRE DE COMMANDE POUR AVOIR LE CONTROLE A FOND.

mapDispatchToProps is so very ugly

https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d

Pour avoir acces a des variables ou des fonctions pour tester, je peux faire:
window.variable = variable;
ou
window.function = function;

Faire un application de spreesheet.

La page d'acceuil est une liste de toute les tables avec seulement leurs noms en ordre alphabetique. Quand je click sur une, ca ouvre vers la table.

Toutefois, ce qui est innovant est de pouvoir imbriquer une table dans une autre table. Dans la vue en tout cas. Le modele existe encore quand meme par lui-meme, mais on le visualise a l'interieur de la table.

Le feature le plus important je crois est le zoom infini.

Dans le fond, juste faire un navigateur pour l'instant? Parce tous le reste revient a
reinventer des applications qui marche deja comme Spreadsheet et Word, etc.

Ce qui innovateur est de naviguer en se deplacant et zoomant dans un monde facile pour notre memoire a naviguer.

Au moins pouvoir ecrire du texte.

Donner des liens au File:/// protocol, mais c pas bon ca pcq c juste local...

J'ai deux problemes que je veux resoudre:

- Avoir une base do donnees.
- Naviguer dans cette base de donnees.

Ca serait nice de pouvoir avoir une vue isometrique aussi pas juste quadrille.
Une vue comme age of empires ou tous les jeux videos. Ca serait du pseudo 3d! Ca serait
pas mal plus beau comme home.

git push -u origin master

https://css-tricks.com/snippets/css/complete-guide-grid/

serve -s build

Notes sur React:

Mon point de vue:
Un React.Component est comme un mix entre une vue et un modele.

Je pense qu'une variable devrait etre un props si et seulement si ca modifie sa vue.

Par exemple, je ne crois pas que firebase ne devrait etre un props. C'est juste
une reference a une database. Ca n'affecte en rien la vue.

Aussi, un state est simplement un props, mais qui est prive a lui-meme.

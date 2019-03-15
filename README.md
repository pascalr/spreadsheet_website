Feature list:
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


mapDispatchToProps is so very ugly

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





This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

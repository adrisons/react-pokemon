<a href="https://adrisons.github.io/react-pokemon/" target="_blank">:rocket: Deploy</a>

<div align="center">
<h1>Pokemon React App</h1>
</div>

<div align="center">
	<a href="#scripts">Scripts</a>&nbsp;&nbsp;&nbsp;
	<a href="#technical-details">Technical details</a>&nbsp;&nbsp;&nbsp;
	<a href="#learn-more">Learn more</a>&nbsp;&nbsp;&nbsp;
</div>

---

<div align="center">
<strong>Pokemon React App</strong> is a web app developed with React which uses 
<a href="https://pokeapi.co">pokeapi.co</a> API to display pokemon list and <a href="https://pokeres.bastionbot.org">pokeres.bastionbot.org</a> to find pokemon pictures.
</div>

---

## Scripts

We will use [`yarn`](https://yarnpkg.com/) as package manager.

Before running any script run `yarn install` to download dependencies.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:Technical details

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Technical Details

Two APIs are used:

- To fetch pokemon data: https://pokeapi.co/api/v2/pokemon/
- To fetch pokemon pictures: https://pokeres.bastionbot.org/images/pokemon/:id.png

Tests are implemented with [jest](https://jestjs.io/).

TODO: `pages` tests are not complete because there was no official enzyme adapter for React v17 when this project was made.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

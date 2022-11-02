Components Folder -- (I didn't delete components just in case they where being in use by someone else, I plan on eventually moving some though)
    - BasicButton
        - Basic button that takes in a 
    - ButtonList //planning on removing
    - Chart1 //planning on removing since moving to apex
        - Test Graph, just to see how to display a graph on react
    - DropDownTest 
        - For testing dropdowns
    - DropDownTest2 // planning on removing
        - the dropdown list customized for SelectingScenario
        - Since SelectingScenario is being replaced with SelectingScenarioNew, this can be safely removed
    - MainButton //planning on removing
        - Testing how to switch pages, but this functionality has been moved to the Navbar
    - NavbarForWeb
        - A navbar that transitions between the various pages of the site
    - SelectingScenario //planning on removing eventually
        - No longer works due to the changes to the endpoints(this one had used dummy endpoints), 
        - Did not remove in case anyone was using the component in any way
        - Instead look at SelectingScenarioNew
    - SelectingScenarioNew
        - When the component is mounted, it gets a list of scenarios from the server
        - Currently SelectingScenarioNew.js has a custom dropdown component inside the file for ease of editing it to function with the SelectingScenarioNew Component, it can be moved out of the file later.
        - Currently this component also handles the node dropdown, but this entire component should probably be split into multiple smaller components
    - TimeTesting
        - Currently not in use, but may be needed later
        - Takes in a user inputted time, and outputs that time in UTC-0
    - GraphFolder - Contains the implmentation for the graphs needed for usecase #1
        -HistogramTest - Implements the Histogram from use case 1
        -ScatterLMP - Implements the Scatter plot from use case 1

Pages Folder - Contains React Components that makes up the Pages of the website
    - Anaylsis
        - The Anaylsis Page will eventually allow the user to select, the scenario, metric, time period, and pnode grouping to run analysis one, showing various metrics based on the user selection(base case 2)
    - Home
        - The Landing page will eventually allow the user to sign in?
    - SanityCheck
        - The Sanity Check Page will allow the user to select a scenario and a node in the scenario, showing various graphs comparing it to the base case
            - Currently it gets a list of scenarios from the server and creates a dropdown menu allowing the user to pick a scenario in the list
            - After Choosing a scenario, it gets a list of nodes from the server and creates a dropdown menu allowing the user to pick a node

App.js
    - The Website itself



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

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

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


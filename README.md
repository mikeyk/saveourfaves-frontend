This is the frontend to saveourfaves.org; it pairs with [the backend code, also open source](https://github.com/mikeyk/saveourfaves-server), so please read the README there as well.

You'll need to copy over the src/Config.js.example file to src/Config.js and update it with your own Google Maps API key (needs Places API enabled) and a Google Analytics ID.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />

Once built, you can deploy that build/ folder to the Nginx container under /usr/local/build/current/

### Other notes

The snugtop.jpeg image was provided by The Snug in San Francisco.
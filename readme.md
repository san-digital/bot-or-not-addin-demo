# Bot or Not - Word Add-in

This is a demo application to show you how to build a Word Add-in.

## How to use the app

Clicking the check text button will pull in the selected text from the Word document. These words are then sent to the bot or not service to check if they are written by a human or a bot. The user sees a smiley human face or a bemused robot face depending on the result.

## Developing locally

`yarn start` will start Word and the app in a local web server running on port 3000. It supports hot reloading.

### Fake server

To develop locally against a fake server, run `yarn run fake-server` and then `yarn start`. The fake server will run on port 3001. It will return a bot response, but with 2 hardcoded text items for bot and human. This is useful for testing the UI.

## Building for production

`yarn build` will build the app into the `dist` folder. Ensure you have set up webpack.config.js to point to your own web server where these files will be hosted.


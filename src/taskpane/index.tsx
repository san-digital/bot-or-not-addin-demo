import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { loadTheme, ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { appTheme, resetClass } from "./theme";

/* global document, Office, module, require */

initializeIcons();

loadTheme(appTheme);

let isOfficeInitialized = false;

const title = "Bot or Not?";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider className={resetClass} theme={appTheme}>
        <Component title={title} isOfficeInitialized={isOfficeInitialized} />
      </ThemeProvider>
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  // if (!Office.context.requirements.isSetSupported("WordApi", "1.3")) {
  //   console.log("Sorry. The tutorial add-in uses Word.js APIs that are not available in your version of Office.");
  // }

  isOfficeInitialized = true;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}

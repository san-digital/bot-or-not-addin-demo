import * as React from "react";
import Progress from "./Progress";
import BotOrNotChecker from "./BotOrNotChecker";
import { mergeStyles } from "@fluentui/react";
import { appTheme } from "../theme";
import Header from "./Header";

/* global require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {}

const backgroundStyle = mergeStyles({
  backgroundColor: appTheme.palette.themePrimary,
  color: appTheme.palette.white,
});

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {}

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div>
        <Header
          logo={require("./../../../assets/botornot.webp")}
          title={this.props.title}
          message="Find the real writer: Bot&nbsp;or&nbsp;Not"
        />
        <BotOrNotChecker />
      </div>
    );
  }
}

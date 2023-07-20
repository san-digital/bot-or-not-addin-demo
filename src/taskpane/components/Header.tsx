import * as React from "react";
import { mergeStyles, Text } from "@fluentui/react";

const sectionWrapper = mergeStyles({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const textWrapper = mergeStyles({
  textAlign: "center",
});

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section className={sectionWrapper}>
        <img width="300px" height="300px" src={logo} alt={title} title={title} />
        <Text className={textWrapper} variant="xLarge" block={true}>
          {message}
        </Text>
      </section>
    );
  }
}

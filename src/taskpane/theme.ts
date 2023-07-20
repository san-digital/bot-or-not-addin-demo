import { mergeStyles, PartialTheme } from "@fluentui/react";

export const appTheme: PartialTheme = {
  defaultFontStyle: { fontFamily: "Inter, sans-serif" },
  palette: {
    themePrimary: "#060a1a",
    white: "#ffffff",
  },
};

export const resetClass = mergeStyles([
  {
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
  },
]);

import React from "react";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
} from "@material-ui/core/styles";

export interface ThemeProps extends ThemeOptions {
  navBar?: {
    main: React.CSSProperties["color"];
    selected: React.CSSProperties["color"];
    innerBorder: React.CSSProperties["color"];
    text: React.CSSProperties["color"];
  };
  paper?: {
    main: React.CSSProperties["color"];
  };
  background?: {
    main: React.CSSProperties["color"];
  };
  selectedNavbar?: {
    main: React.CSSProperties["color"];
  };
  formSectionBackground?: {
    main: React.CSSProperties["color"];
  };
}

declare module "@material-ui/core/styles/createTheme" {
  interface ThemeOptions {
    navBar?: {
      main: React.CSSProperties["color"];
      selected: React.CSSProperties["color"];
      innerBorder: React.CSSProperties["color"];
      text: React.CSSProperties["color"];
    };
    paper?: {
      main: React.CSSProperties["color"];
    };
    background?: {
      main: React.CSSProperties["color"];
    };
    selectedNavbar?: {
      main: React.CSSProperties["color"];
    };
    formSectionBackground?: {
      main: React.CSSProperties["color"];
    };
  }
}

export const theme: ThemeProps = createTheme({
  palette: {
    primary: {
      main: "#4f5b66",
    },
    secondary: {
      main: "#55341",
    },
  },
  typography: {
    h6: {
      // eslint-disable-next-line quotes
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
    },
  },
  navBar: {
    main: "#dfd7d2",
    selected: "#a2a79b",
    innerBorder: "#ffffff",
    text: "#ffffff",
  },
  paper: {
    main: "#c0c5ce",
  },
  background: {
    main: "#c0c5ce",
  },
  selectedNavbar: {
    main: "#65737e",
  },
  formSectionBackground: {
    main: "#7f95b8",
  },
});

export const MorphwareTheme: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

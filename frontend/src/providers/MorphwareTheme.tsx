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
  metaDataContainer?: {
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
    metaDataContainer?: {
      main: React.CSSProperties["color"];
    };
  }
}

export const theme: ThemeProps = createTheme({
  palette: {
    primary: {
      main: "#5B676D",
    },
    secondary: {
      main: "#55341",
    },
  },
  typography: {
    h6: {
      // eslint-disable-next-line quotes
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "20px",
      color: "#5B676D",
    },
    body1: {
      // eslint-disable-next-line quotes
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "17px",
    },
    body2: {
      // eslint-disable-next-line quotes
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "18px",
    },
  },
  navBar: {
    main: "#ffffff",
    selected: "#C8C8C8",
    innerBorder: "#afaeae",
    text: "#4B4B4C",
  },
  paper: {
    main: "#C8C8C8",
  },
  background: {
    main: "#ececec",
  },
  selectedNavbar: {
    main: "#65737e",
  },
  formSectionBackground: {
    main: "#dbd9d9",
  },
  metaDataContainer: {
    main: "#5B676D",
  },
  overrides: {
    MuiSwitch: {
      track: {
        // opacity: 0.2,
        // backgroundColor: "#fffff",
        "$checked$checked + &": {
          opacity: 0.7,
          backgroundColor: "green",
          color: "white",
        },
      },
    },
  },
});

export const MorphwareTheme: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

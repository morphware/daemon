/* eslint-disable quotes */
import React, { useContext } from "react";
import { createTheme, Theme, ThemeProvider } from "@material-ui/core/styles";
import { UtilsContext } from "./UtilsProvider";

export interface ThemeProps extends Theme {
  navBar?: {
    main: React.CSSProperties["color"];
    selected: React.CSSProperties["color"];
    innerBorder: React.CSSProperties["color"];
    text: React.CSSProperties["color"];
  };
  text?: {
    main: React.CSSProperties["color"];
    inverted: React.CSSProperties["color"];
    bold: React.CSSProperties["color"];
    dropdown: React.CSSProperties["color"];
  };
  paper?: {
    main: React.CSSProperties["color"];
  };
  dropdown?: {
    main: React.CSSProperties["color"];
    selected: React.CSSProperties["color"];
  };
  background?: {
    main: React.CSSProperties["color"];
  };
  selectedNavbar?: {
    main: React.CSSProperties["color"];
    selected: React.CSSProperties["color"];
  };
  formSectionBackground?: {
    main: React.CSSProperties["color"];
  };
  metaDataContainer?: {
    main: React.CSSProperties["color"];
  };
  WalletFooterInfo?: {
    main: React.CSSProperties["color"];
    text: React.CSSProperties["color"];
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
    text?: {
      main: React.CSSProperties["color"];
      inverted: React.CSSProperties["color"];
      bold: React.CSSProperties["color"];
      dropdown: React.CSSProperties["color"];
    };
    paper?: {
      main: React.CSSProperties["color"];
    };
    dropdown?: {
      main: React.CSSProperties["color"];
      selected: React.CSSProperties["color"];
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
    WalletFooterInfo?: {
      main: React.CSSProperties["color"];
      text: React.CSSProperties["color"];
    };
  }
}

export const lightMode: ThemeProps = createTheme({
  palette: {
    primary: {
      main: "#dbd9d9",
    },
    secondary: {
      main: "#5B676D",
    },
  },
  text: {
    main: "#5B676D",
    inverted: "#FFFFFF",
    bold: "#5B676D",
    dropdown: "#5B676D",
  },
  typography: {
    fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
    h4: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "40px",
      color: "#5B676D",
    },
    h5: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "30px",
      color: "#5B676D",
    },
    h6: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "20px",
      color: "#5B676D",
    },
    body1: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "17px",
      color: "#5B676D",
    },
    body2: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "18px",
      color: "#5B676D",
    },
  },
  navBar: {
    main: "#ececec",
    selected: "#C8C8C8",
    innerBorder: "#afaeae",
    text: "#4B4B4C",
  },
  paper: {
    main: "#C8C8C8",
  },
  dropdown: {
    main: "#ffffff",
    selected: "#d0d0d0",
  },
  background: {
    main: "#ffffff",
  },
  selectedNavbar: {
    main: "#65737e",
  },
  formSectionBackground: {
    main: "#fbfbfb",
  },
  metaDataContainer: {
    main: "#5B676D",
  },
  overrides: {
    MuiSwitch: {
      track: {
        "$checked$checked + &": {
          opacity: 0.7,
          backgroundColor: "green",
          color: "white",
        },
      },
    },
    MuiInputBase: {
      root: {
        color: "black",
      },
    },
    MuiFormLabel: {
      root: {
        color: "black",
      },
    },
    MuiFormControlLabel: {
      label: {
        color: "#5B676D",
      },
    },
  },
  WalletFooterInfo: {
    main: "#f7f9fa",
    text: "#424549",
  },
});

export const darkMode: ThemeProps = createTheme({
  palette: {
    primary: {
      main: "#dbd9d9",
    },
    secondary: {
      main: "#829AA6",
    },
  },
  text: {
    main: "#FFFFFF",
    inverted: "#384043",
    bold: "#e0e0e0",
    dropdown: "#384043",
  },
  typography: {
    fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
    h4: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "40px",
      color: "#D9DDE2",
    },
    h5: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "30px",
      color: "#D9DDE2",
    },
    h6: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "20px",
      color: "#D9DDE2",
    },
    body1: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "17px",
      color: "#D9DDE2",
    },
    body2: {
      fontFamily: ['"Ubuntu"', "Open Sans"].join(","),
      fontSize: "18px",
      color: "#FFFFFF",
    },
  },
  navBar: {
    main: "#36393e",
    selected: "#282b30",
    innerBorder: "#1e2124",
    text: "#ffffff",
  },
  paper: {
    main: "#C8C8C8",
  },
  dropdown: {
    main: "#787d83",
    selected: "#93979b",
  },
  background: {
    main: "#575D65",
  },
  selectedNavbar: {
    main: "#65737e",
  },
  formSectionBackground: {
    main: "#53575C",
  },
  metaDataContainer: {
    main: "#D9DDE2",
  },
  overrides: {
    MuiSwitch: {
      track: {
        "$checked$checked + &": {
          opacity: 0.7,
          backgroundColor: "#6ACE6D",
          color: "white",
        },
      },
    },
    MuiInputBase: {
      root: {
        color: "white",
      },
    },
    MuiFormLabel: {
      root: {
        color: "white",
      },
    },
    MuiFormControlLabel: {
      label: {
        color: "#e0e0e0",
      },
    },
    MuiMenuItem: {
      selected: {
        color: "red",
        backgroundColor: "blue",
      },
    },
    MuiListItem: {
      default: {
        backgroundColor: "red",
      },
      selected: {
        color: "red",
        backgroundColor: "blue",
      },
      root: {
        color: "red",
        backgroundColor: "#787d83",
      },
    },
  },
  WalletFooterInfo: {
    main: "#424549",
    text: "#ffffff",
  },
});

export const MorphwareTheme: React.FC = ({ children }) => {
  const { darkTheme } = useContext(UtilsContext);
  const theme = darkTheme ? darkMode : lightMode;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

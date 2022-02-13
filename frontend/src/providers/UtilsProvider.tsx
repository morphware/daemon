/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { DaemonContext } from "./ServiceProviders";

export const UtilsContext = React.createContext({} as utilsProps);

interface utilsProps {
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const UtilsProvider: React.FC = ({ children }) => {
  const daemonService = useContext(DaemonContext);
  console.log(" UTILS PROVIDER Settings CAT: ", daemonService.currentConfigs);
  console.log("darkMode? ", daemonService.currentConfigs?.darkMode);
  const darkModeInitially = daemonService.currentConfigs?.darkMode
    ? true
    : false;
  console.log("daekModeInitially: ", darkModeInitially);
  const [darkTheme, setDarkTheme] = useState<boolean>(darkModeInitially);

  useEffect(() => {
    setDarkTheme(darkModeInitially);
  }, [darkModeInitially]);

  const utilsContext = useMemo(() => {
    return { darkTheme: darkTheme, setDarkTheme: setDarkTheme };
  }, [darkTheme]);

  console.log("UTILS CONTEXT: ", utilsContext);
  console.log("UTILS CONTEXT HERE: ", darkTheme);

  return (
    <UtilsContext.Provider value={utilsContext}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;

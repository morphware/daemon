/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

export const UtilsContext = React.createContext({} as utilsProps);

interface utilsProps {
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const UtilsProvider: React.FC = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  const utilsContext: utilsProps = {
    darkTheme: darkTheme,
    setDarkTheme: setDarkTheme,
  };

  return (
    <UtilsContext.Provider value={utilsContext}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;

import React, { useContext } from "react";
import PositionedSnackbar from "../components/PositionedSnackbar";
import { DaemonContext } from "../providers/ServiceProviders";

const ScreenViewBox: React.FC = ({ children }) => {
  const { snackBarProps, updateSnackbarProps } = useContext(DaemonContext);

  return (
    <React.Fragment>
      {snackBarProps.text && snackBarProps.severity && (
        <PositionedSnackbar
          text={snackBarProps.text}
          severity={snackBarProps.severity}
          setSnackBarProps={updateSnackbarProps}
        />
      )}
      {children}
    </React.Fragment>
  );
};

export default ScreenViewBox;

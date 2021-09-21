import * as React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { Typography } from "@material-ui/core";

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface PositionedSnackbarProps {
  verticalProp?: "top" | "bottom";
  horizontalProp?: "left" | "center" | "right";
  severity: "error" | "warning" | "info" | "success";
  text: string;
  openProp?: boolean;
}

const PositionedSnackbar = ({
  verticalProp = "top",
  horizontalProp = "right",
  openProp = true,
  text,
  severity,
}: PositionedSnackbarProps) => {
  const [state, setState] = React.useState<State>({
    open: openProp,
    vertical: verticalProp,
    horizontal: horizontalProp,
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={8000}
        style={{ color: "#2e7d32" }}
      >
        <Alert severity={severity} variant="filled" elevation={6}>
          <Typography variant="body2"> {text}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PositionedSnackbar;

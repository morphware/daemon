import * as React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { Slide, Typography } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
export interface State extends SnackbarOrigin {
  open: boolean;
}

export interface snackBarProps {
  text?: string;
  severity?: "error" | "warning" | "info" | "success";
}

interface PositionedSnackbarProps {
  verticalProp?: "top" | "bottom";
  horizontalProp?: "left" | "center" | "right";
  severity: "error" | "warning" | "info" | "success";
  text: string;
  openProp?: boolean;
  setSnackBarProps: React.Dispatch<React.SetStateAction<snackBarProps>>;
}

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

const PositionedSnackbar = ({
  verticalProp = "top",
  horizontalProp = "right",
  openProp = true,
  text,
  severity,
  setSnackBarProps,
}: PositionedSnackbarProps) => {
  const [state, setState] = React.useState<State>({
    open: openProp,
    vertical: verticalProp,
    horizontal: horizontalProp,
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
    setSnackBarProps({});
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
      autoHideDuration={4000}
      style={{ color: "#2e7d32" }}
      TransitionComponent={TransitionRight}
    >
      <Alert severity={severity} variant="filled" elevation={6}>
        <Typography variant="body2">
          {text}
          {/* <IconButton color="inherit">
                  <CloseIcon />
                </IconButton> */}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PositionedSnackbar;

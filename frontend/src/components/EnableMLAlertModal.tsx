/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { useSpring, animated } from "react-spring";
import { ThemeProps } from "../providers/MorphwareTheme";
import { useTheme } from "@emotion/react";

const useStyles = makeStyles((theme: ThemeProps) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.background?.main,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: "350px",
    },
    viewTransactionButton: {
      padding: "15px",
      borderTop: "15px",
      border: "1px solid black",
      backgroundColor: theme.text?.bold,
      color: theme.text?.inverted,
    },
    formText: {
      color: theme.text?.main,
    },
    headers: {
      color: theme.text?.bold,
    },
  })
);

interface FadeProps {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  // eslint-disable-next-line react/prop-types
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

interface IEnableMLAlertModal {
  enableML: () => void;
  closeModal: () => void;
}

const EnableMLAlertModal = ({ enableML, closeModal }: IEnableMLAlertModal) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [toggleModal, setTogalModal] = useState<boolean>(true);

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={true}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <div className={classes.paper}>
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography variant="body2" className={classes.headers}>
                  This feature is under heavy development. Do not enable this on
                  any wallet with funds
                </Typography>
              </Grid>
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color={toggleModal ? "primary" : "secondary"}
                    style={{ width: "60%" }}
                    onClick={() => {
                      enableML();
                      closeModal();
                    }}
                  >
                    Enable
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color={toggleModal ? "primary" : "secondary"}
                    style={{ width: "60%" }}
                    onClick={closeModal}
                  >
                    Return
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default EnableMLAlertModal;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
// import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import { Box, Button, Grid, IconButton, Typography } from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useSpring, animated } from "react-spring";
import { DaemonContext } from "../providers/ServiceProviders";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Form } from "react-final-form";
import { TextField } from "mui-rff";
import { SendMWTRequestProps } from "../service/DaemonService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "white",
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: "350px",
      height: "500px",
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

const WalletModal = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [toggleModal, setTogalModal] = useState<boolean>(false);
  const daemonService = useContext(DaemonContext);

  const shortenedAddressStart = daemonService.walletAddress?.slice(0, 7);
  const shortenedAddressEnd = daemonService.walletAddress?.slice(39, 43);
  const shortenedAddress = `${shortenedAddressStart}...${shortenedAddressEnd}`;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyToClipBoard = () => {
    if (daemonService.walletAddress)
      navigator.clipboard.writeText(daemonService.walletAddress);
  };

  const sendMWT = async (values: SendMWTRequestProps) => {
    console.log("values: ", values);
    const transaction = await daemonService.sendMWT(values);
  };

  const historyTransaction = async () => {
    daemonService.sendMWT;
  };

  const SendMWTForm = () => {
    return (
      <Form
        onSubmit={sendMWT}
        validate={(values: SendMWTRequestProps) => {
          const errors = {} as SendMWTRequestProps;
          const amount = parseFloat(values.amount);
          // const gas = values.gas parseFloat(values.gas);
          var gas;
          if (values.gas) {
            gas = parseFloat(values.gas);
          }
          const walletBalance = daemonService.walletBalance
            ? parseFloat(daemonService.walletBalance)
            : 0;

          if (!values.address) {
            //Check if a valid address
          }
          if (amount <= 0) {
            errors.amount = "Invalid amount";
          }
          if (amount > walletBalance) {
            errors.amount = "Insufficient Funds";
          }
          if (gas && gas <= 0) {
            errors.gas = "Invalid amount";
          }

          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            className="frm_upload"
            onSubmit={handleSubmit}
            style={{ height: "100%" }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid
                container
                xs={12}
                style={{ marginTop: 16 }}
                justifyContent="center"
              >
                Recipient
              </Grid>
              <Grid
                item
                justifyContent="center"
                style={{ display: "flex", width: "100%" }}
              >
                <TextField
                  name="address"
                  required={true}
                  type="text"
                  variant="outlined"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Grid>
              <Grid
                container
                xs={12}
                style={{ marginTop: 5 }}
                justifyContent="center"
              >
                Amount
              </Grid>
              <Grid
                item
                justifyContent="center"
                style={{ display: "flex", width: "100%" }}
              >
                <TextField
                  name="amount"
                  required={true}
                  type="number"
                  variant="outlined"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Grid>
              <Grid
                container
                xs={12}
                style={{ marginTop: 5 }}
                justifyContent="center"
              >
                Gas Limit
              </Grid>
              <Grid
                item
                justifyContent="center"
                style={{ display: "flex", width: "100%" }}
              >
                <TextField
                  name="gas"
                  // required={true}
                  type="number"
                  variant="outlined"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  placeholder="optional (gwei)"
                />
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  };

  return (
    <div>
      <IconButton style={{ width: "fit-content" }} onClick={handleOpen}>
        <AccountBalanceWalletIcon style={{ fontSize: 48 }} color="secondary" />
      </IconButton>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              // spacing
            >
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography variant="body2">Account1</Typography>
              </Grid>
              <Box display="flex" alignItems="center">
                <Typography variant="body2">{shortenedAddress}</Typography>
              </Box>
              <IconButton onClick={copyToClipBoard}>
                <FileCopyIcon fontSize="small" color="secondary" />
              </IconButton>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                {daemonService.walletBalance}
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                MWT
              </Grid>
              <Grid
                container
                xs={12}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid
                  item
                  xs={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <Button
                    variant={toggleModal ? "contained" : "outlined"}
                    color={toggleModal ? "primary" : "secondary"}
                    style={{ width: "60%" }}
                  >
                    Activity
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
                    color={toggleModal ? "secondary" : "primary"}
                    style={{ width: "60%" }}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
              <Box>
                <SendMWTForm />
              </Box>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default WalletModal;

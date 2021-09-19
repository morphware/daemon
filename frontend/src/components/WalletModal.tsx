/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { Box, Button, Grid, IconButton, Typography } from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useSpring, animated } from "react-spring";
import { DaemonContext } from "../providers/ServiceProviders";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Form } from "react-final-form";
import { TextField } from "mui-rff";
import {
  SendMWTRequestProps,
  TransactionProps,
} from "../service/DaemonService";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import Web3 from "web3";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { copyToClipBoard, roundBalance, walletShortener } from "../utils";

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
      height: "520px",
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
  const [toggleModal, setTogalModal] = useState<boolean>(true);
  const daemonService = useContext(DaemonContext);

  const shortenedAddress = walletShortener(daemonService.walletAddress);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendMWT = async (values: SendMWTRequestProps) => {
    console.log("values: ", values);
    const transaction = await daemonService.sendMWT(values);
  };

  const HistoryTransaction = (historyTransactionItem: TransactionProps) => {
    const recieving =
      historyTransactionItem.returnValues.to === daemonService.walletAddress
        ? true
        : false;

    const viewTransaction = () => {
      const url = `https://ropsten.etherscan.io/tx/${historyTransactionItem.transactionHash}`;
      window.open(url);
    };

    return (
      <Button onClick={viewTransaction}>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          padding={0}
        >
          <Box padding={1}>
            {recieving ? (
              <CallMadeIcon color="primary" style={{ fontSize: 30 }} />
            ) : (
              <VerticalAlignBottomIcon
                color="primary"
                style={{ fontSize: 30 }}
              />
            )}
          </Box>
          <Box padding={1}>
            <Typography variant="body2">
              {Web3.utils.fromWei(
                historyTransactionItem.returnValues.value,
                "ether"
              )}
              MWT
            </Typography>
          </Box>
        </Box>
      </Button>
    );
  };

  const GenerateHistoryItems = () => {
    // const transactions = daemonService.walletHistory?.transactions
    //   ? daemonService.walletHistory?.transactions
    //   : [];

    console.log(daemonService.walletHistory?.transactions);
    const transactions: Array<any> = [];

    const historyLessThanFive =
      transactions.length < 5 ? transactions : transactions.slice(-4);

    historyLessThanFive.reverse();

    return (
      <Box
        width="100%"
        justifyContent="center"
        display="flex"
        flexDirection="column"
        alignContent="center"
        padding={1}
      >
        {historyLessThanFive.map((item) => HistoryTransaction(item))}
        {transactions.length >= 4 && (
          <Button
            style={{
              padding: "15px",
              borderTop: "15px",
              border: "1px solid black",
            }}
            color="primary"
            variant="outlined"
            onClick={viewAllTransactions}
          >
            View All Transactions
          </Button>
        )}
        {transactions.length === 0 && (
          <Box display="flex" justifyContent="center" paddingTop="20px">
            <Typography variant="body2">No Transactions Completed</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const viewAllTransactions = () => {
    const url = `https://ropsten.etherscan.io/token/${daemonService.MWTAddress}?a=${daemonService.walletAddress}`;
    console.log("Url: ", url);
    window.open(url);
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
                <Typography variant="body2">Recipient</Typography>
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
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Grid>
              <Grid
                container
                xs={12}
                style={{ marginTop: 5 }}
                justifyContent="center"
              >
                <Typography variant="body2">Amount</Typography>
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
                  placeholder="MWT"
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Grid>
              <Grid
                container
                xs={12}
                style={{ marginTop: 5 }}
                justifyContent="center"
              >
                <Typography variant="body2">Gas Limit</Typography>
              </Grid>
              <Grid
                item
                justifyContent="center"
                style={{ display: "flex", width: "100%" }}
              >
                <TextField
                  name="gas"
                  type="number"
                  variant="outlined"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  placeholder="optional (gwei)"
                  inputProps={{ style: { textAlign: "center" } }}
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

  const roundedBalance = roundBalance(daemonService.walletBalance);

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
            >
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography variant="body2">Account1</Typography>
              </Grid>
              <Box display="flex" alignItems="center">
                <Typography variant="body2">{shortenedAddress}</Typography>
              </Box>
              <IconButton
                onClick={() => copyToClipBoard(daemonService.walletAddress)}
              >
                <FileCopyIcon fontSize="small" color="secondary" />
              </IconButton>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography variant="h6"> {roundedBalance}</Typography>
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Typography variant="h6">MWT </Typography>
              </Grid>
              <Grid
                container
                xs={12}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid item xs={6}>
                  <Button
                    variant={toggleModal ? "contained" : "outlined"}
                    color={toggleModal ? "primary" : "secondary"}
                    style={{ width: "60%" }}
                    onClick={() => {
                      if (!toggleModal) {
                        setTogalModal(true);
                      }
                    }}
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
                  {/* Toggal modal is False */}
                  <Button
                    type="submit"
                    variant="contained"
                    color={toggleModal ? "secondary" : "primary"}
                    style={{ width: "60%" }}
                    onClick={() => {
                      if (toggleModal) {
                        setTogalModal(false);
                      }
                    }}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
              <Grid container>
                {toggleModal ? <GenerateHistoryItems /> : <SendMWTForm />}
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default WalletModal;

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import { theme } from "../providers/MorphwareTheme";
import { TextField } from "mui-rff";
import { Form } from "react-final-form";
import { Radios } from "./Radios";
import { Switches, SwitchData } from "mui-rff";
import FileField from "./FileField";
import { DaemonContext } from "../providers/ServiceProviders";
import { SettingsRequestProps } from "../service/DaemonService";
import Web3 from "web3";
import { ethers } from "ethers";
import Tooltip from "@mui/material/Tooltip";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

interface SettingsRequestPropsErrors {
  httpBindAddress?: string;
  httpPort?: string;
  privateKey?: string;
  acceptWork?: string;
  torrentListenPort?: string;
  dataPath?: string;
}

const SettingsForm = () => {
  const daemonService = useContext(DaemonContext);

  const updateConfigurations = async (values: SettingsRequestProps) => {
    console.log("values: ", values);

    const response = await daemonService.updateSettings(values);
    console.log("Response: ", response);

    //Show Modal to restart
  };

  return (
    <div>
      <Form
        onSubmit={updateConfigurations}
        validate={(values) => {
          const errors = {} as SettingsRequestPropsErrors;

          try {
            if (values.privateKey) {
              const validPrivateKey = new ethers.Wallet(values.privateKey);
            }
          } catch (e) {
            errors.privateKey = "Invalid Private Key";
          }

          if (values.torrentListenPort && values.torrentListenPort <= 0) {
            errors.torrentListenPort = "Invalid Port";
          }
          return errors;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <form
            className="frm_upload"
            onSubmit={handleSubmit}
            style={{ height: "100%" }}
          >
            <Grid container alignItems="flex-start" spacing={2}>
              <Paper
                style={{
                  padding: 30,
                  width: "100%",
                  backgroundColor: theme.formSectionBackground?.main,
                }}
                elevation={3}
              >
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12} style={{ textAlign: "start" }}>
                    <Typography variant="h5">Settings</Typography>
                  </Grid>
                  <Grid container xs={12} spacing={2}>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                      >
                        Private Key
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <TextField
                        label="Private Key"
                        name="privateKey"
                        required={true}
                        type="text"
                        style={{
                          width: "80%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                      >
                        Data Path
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {/* <FileField
                        name="DatePath"
                        buttonText="Data Path"
                        acceptedValues={[]}
                        removeFilesSignal={false}
                        webkitdirectory={true}
                        directory={true}
                      /> */}
                      <TextField
                        label="Location to store jobs"
                        name="dataPath"
                        // required={true}
                        type="text"
                        value="No Folder Selected"
                        // defaultValue="No Folder Selected"
                        inputProps={{
                          readOnly: true,
                        }}
                        style={{
                          width: "70%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      />
                      <IconButton
                        style={{ width: "10%" }}
                        // className={classes.removeFileIcon}
                        // aria-label="delete"
                        // onClick={removeUploadedFile}
                      >
                        <DriveFileRenameOutlineIcon
                          fontSize="large"
                          // color="primary"
                        />
                      </IconButton>
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                      >
                        Torrent Listening Port
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <TextField
                        label="Torrent Listening Port"
                        name="torrentListenPort"
                        required={true}
                        type="number"
                        style={{
                          width: "30%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                      >
                        Accept Work
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Switches
                        name="acceptWork"
                        // required={true}
                        data={{ label: "", value: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <Grid
                container
                xs={12}
                style={{ marginTop: 16 }}
                justifyContent="flex-end"
              >
                <Grid item style={{ paddingRight: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      form.reset();
                    }}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
              <Grid item style={{ marginTop: 16 }}></Grid>
            </Grid>
          </form>
        )}
      />
    </div>
  );
};

export default SettingsForm;

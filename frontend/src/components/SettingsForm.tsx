import { Button, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { theme } from "../providers/MorphwareTheme";
import { TextField } from "mui-rff";
import { Form, useForm } from "react-final-form";
import { Switches } from "mui-rff";
import { DaemonContext } from "../providers/ServiceProviders";
import { SettingsRequestProps } from "../service/DaemonService";
import { ethers } from "ethers";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IpcRenderer } from "electron";
import PositionedSnackbar from "./PositionedSnackbar";
import { snackBarProps } from "../components/PositionedSnackbar";
interface SettingsRequestPropsErrors {
  httpBindAddress?: string;
  httpPort?: string;
  privateKey?: string;
  acceptWork?: string;
  torrentListenPort?: string;
  dataPath?: string;
}
declare global {
  interface Window {
    renderer: IpcRenderer;
  }
}

interface AddDataPathProps {
  dataPath?: string;
  setDataPath: React.Dispatch<React.SetStateAction<string>>;
}

const AddDataPath = ({ dataPath, setDataPath }: AddDataPathProps) => {
  const form = useForm();

  const getFolder = () => {
    const dataPath = window.renderer.sendSync("selectFolder");
    setDataPath(dataPath);
    form.change("dataPath", dataPath);
    return dataPath;
  };

  return (
    <>
      <TextField
        label="Location to store jobs"
        name="dataPath"
        type="text"
        value={dataPath}
        required={true}
        placeholder="Path to store torrent data and jobs"
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      />
      <IconButton style={{ width: "10%" }} onClick={getFolder}>
        <DriveFileRenameOutlineIcon fontSize="large" />
      </IconButton>
    </>
  );
};

const SettingsForm = () => {
  const daemonService = useContext(DaemonContext);

  const currentSettngs = daemonService.currentConfigs;
  const currentDataPath = currentSettngs?.dataPath
    ? currentSettngs.dataPath
    : "";
  console.log("currentSettings: ", currentSettngs);

  const [dataPath, setDataPath] = useState<string>(currentDataPath);
  const [snackBarProps, setSnackBarProps] = useState<snackBarProps>({});

  const updateConfigurations = async (values: SettingsRequestProps) => {
    console.log("values: ", values);
    if (!Object.keys(values).includes("acceptWork")) {
      values.acceptWork = false;
    }

    const response = await daemonService.updateSettings(values);
    console.log("Response: ", response);
    setSnackBarProps({
      text: "Changes have been saved. Please restart client to apply changes",
      severity: "success",
    });
  };

  return (
    <div>
      <Form
        onSubmit={updateConfigurations}
        initialValues={currentSettngs}
        validate={(values) => {
          const errors = {} as SettingsRequestPropsErrors;

          try {
            if (values.privateKey) {
              new ethers.Wallet(values.privateKey);
            }
          } catch (e) {
            errors.privateKey = "Invalid Private Key";
          }

          if (values.torrentListenPort) {
            if (values.torrentListenPort <= 0) {
              errors.torrentListenPort = "Invalid Port";
            } else if (
              values.torrentListenPort < 1024 ||
              values.torrentListenPort > 49151
            ) {
              errors.torrentListenPort = "Please choose within 1024-49151";
            }
          }

          if (values.torrentListenPort && values.torrentListenPort <= 0) {
            errors.torrentListenPort = "Invalid Port";
          }

          if (values.torrentListenPort && values.torrentListenPort <= 0) {
            errors.torrentListenPort = "Invalid Port";
          }

          return errors;
        }}
        render={({ handleSubmit, submitting }) => (
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
                {snackBarProps.text && snackBarProps.severity && (
                  <PositionedSnackbar
                    text={snackBarProps.text}
                    severity={snackBarProps.severity}
                    setSnackBarProps={setSnackBarProps}
                  />
                )}
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12} style={{ textAlign: "start" }} />
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
                        type="password"
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
                      <AddDataPath
                        dataPath={dataPath}
                        setDataPath={setDataPath}
                      />
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

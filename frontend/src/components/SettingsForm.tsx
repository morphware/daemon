/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  MenuItem,
  useTheme,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { TextField, Select, Switches } from "mui-rff";
import { Form, useForm } from "react-final-form";
import { DaemonContext } from "../providers/ServiceProviders";
import { SettingsRequestProps } from "../service/DaemonService";
import { ethers } from "ethers";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IpcRenderer } from "electron";
import { ThemeProps } from "../providers/MorphwareTheme";
import { UtilsContext } from "../providers/UtilsProvider";
import EnableMLAlertModal from "./EnableMLAlertModal";
interface SettingsRequestPropsErrors {
  httpBindAddress?: string;
  httpPort?: string;
  privateKey?: string;
  torrentListenPort?: string;
  appDownloadPath?: string;
  darkMode?: string;
}
declare global {
  interface Window {
    renderer: IpcRenderer;
  }
}

interface AddAppDownloadPathProps {
  appDownloadPath?: string;
  setAppDownloadPath: React.Dispatch<React.SetStateAction<string>>;
}

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    formHeaders: {
      ...theme.typography.h6,
    },
    options: {
      color: theme.text?.main,
    },
    selectBackground: {
      backgroundColor: theme.dropdown?.main,
      color: theme.text?.main,
      "&:hover": {
        background: theme.dropdown?.selected,
      },
    },
    active: {
      color: theme.text?.dropdown,
    },
  })
);

const AddAppDownloadPath = ({
  appDownloadPath,
  setAppDownloadPath,
}: AddAppDownloadPathProps) => {
  const theme: ThemeProps = useTheme();
  const form = useForm();
  const classes = styles();
  const getFolder = () => {
    const appDownloadPath = window.renderer.sendSync("selectFolder");
    setAppDownloadPath(appDownloadPath);
    form.change("appDownloadPath", appDownloadPath);
    return appDownloadPath;
  };

  return (
    <>
      <TextField
        label="Location to store jobs"
        name="appDownloadPath"
        type="text"
        value={appDownloadPath}
        required={true}
        placeholder="Path to store torrent data and jobs"
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "flex-start",
        }}
        inputProps={{ className: classes.options }}
        InputLabelProps={{ className: classes.formHeaders }}
      />
      <IconButton style={{ width: "10%" }} onClick={getFolder}>
        <DriveFileRenameOutlineIcon
          fontSize="large"
          style={{ color: theme.text?.main }}
        />
      </IconButton>
    </>
  );
};

const SettingsForm = () => {
  const theme: ThemeProps = useTheme();
  const daemonService = useContext(DaemonContext);
  const { darkTheme, setDarkTheme } = useContext(UtilsContext);
  const currentSettings = daemonService.currentConfigs;
  const currentAppDownloadPath = currentSettings?.appDownloadPath
    ? currentSettings.appDownloadPath
    : "";
  const enableML = currentSettings?.trainModels
    ? currentSettings?.trainModels
    : false;

  // console.log("current Settings");
  // console.log(currentSettings);

  const [appDownloadPath, setAppDownloadPath] = useState<string>(
    currentAppDownloadPath
  );

  const updateConfigurations = async (values: SettingsRequestProps) => {
    console.log(values);
    const response = await daemonService.updateSettings(values);
    if (response.error) {
      daemonService.updateSnackbarProps({
        text: response.error,
        severity: "error",
      });
    } else {
      daemonService.updateSnackbarProps({
        text: "Changes have been saved. Please restart client to apply changes",
        severity: "success",
      });
    }
  };

  const [enableMachineLearning, setEnableMachineLearning] = useState(enableML);
  const [openEnableMachineLearning, setOpenEnableMachineLearning] =
    useState(false);

  const classes = styles();
  return (
    <div>
      <Form
        onSubmit={updateConfigurations}
        initialValues={currentSettings}
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
                elevation={0}
              >
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12} style={{ textAlign: "start" }} />
                  <Grid container xs={12} spacing={2}>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{
                          textAlign: "start",
                          padding: "15px",
                        }}
                        className={classes.formHeaders}
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
                        inputProps={{ className: classes.formHeaders }}
                        InputLabelProps={{ className: classes.formHeaders }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{
                          textAlign: "start",
                          padding: "15px",
                        }}
                        className={classes.formHeaders}
                      >
                        Data Path
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <AddAppDownloadPath
                        appDownloadPath={appDownloadPath}
                        setAppDownloadPath={setAppDownloadPath}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
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
                        inputProps={{ className: classes.options }}
                        InputLabelProps={{ className: classes.formHeaders }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
                      >
                        Jupyter Lab Port
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <TextField
                        label="Jupyter Lab Port"
                        name="jupyterLabPort"
                        required={true}
                        type="number"
                        style={{
                          width: "30%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                        inputProps={{ className: classes.options }}
                        InputLabelProps={{ className: classes.formHeaders }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
                      >
                        Select your GPU
                      </Typography>
                    </Grid>
                    <Grid xs={5} />
                    <Grid
                      item
                      xs={3}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingBottom: "0",
                      }}
                    >
                      <Select
                        name="workerGPU"
                        label="Select your GPU"
                        formControlProps={{ margin: "normal" }}
                        required={true}
                        inputProps={{
                          className: classes.options,
                          style: { backgroundColor: theme.dropdown?.main },
                        }}
                        inputLabelProps={{
                          className: classes.options,
                        }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3090"
                        >
                          3090
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3080Ti"
                        >
                          3080 Ti
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3080"
                        >
                          3080
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3070Ti"
                        >
                          3070 Ti
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3070"
                        >
                          3070
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3060Ti"
                        >
                          3060 Ti
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="3060"
                        >
                          3060
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2080Ti"
                        >
                          2080 Ti
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2080s"
                        >
                          2080 Super
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2080"
                        >
                          2080
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2070s"
                        >
                          2070 Super
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2070"
                        >
                          2070
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2060s"
                        >
                          2060 Super
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="2060"
                        >
                          2060
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
                      >
                        Select your Role
                      </Typography>
                    </Grid>
                    <Grid xs={5} />
                    <Grid
                      item
                      xs={3}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingBottom: "0",
                      }}
                    >
                      <Select
                        name="role"
                        label="Select your role"
                        formControlProps={{ margin: "normal" }}
                        required={true}
                        inputProps={{ className: classes.options }}
                        inputLabelProps={{ className: classes.options }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="Poster"
                        >
                          Poster
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="Worker"
                        >
                          Worker
                        </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectBackground,
                            selected: classes.active,
                          }}
                          value="Validator"
                        >
                          Validator
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
                      >
                        Dark Mode
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Switches
                        name="darkMode"
                        data={{ label: "", value: darkTheme }}
                        checked={darkTheme}
                        onClick={() => {
                          setDarkTheme(!darkTheme);
                        }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "start", padding: "15px" }}
                        className={classes.formHeaders}
                      >
                        Enable Machine Learning
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Switches
                        name="trainModels"
                        data={{ label: "", value: darkTheme }}
                        checked={enableMachineLearning}
                        onClick={() => {
                          if (!enableMachineLearning) {
                            setOpenEnableMachineLearning(true);
                          } else {
                            setEnableMachineLearning(false);
                          }
                        }}
                      />
                      {openEnableMachineLearning && (
                        <EnableMLAlertModal
                          enableML={() => setEnableMachineLearning(true)}
                          closeModal={() => setOpenEnableMachineLearning(false)}
                        />
                      )}
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

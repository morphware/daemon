/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useContext, useEffect } from "react";
import { Form, Field } from "react-final-form";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { TextField } from "mui-rff";
import type { InputHTMLAttributes } from "react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Radios } from "./Radios";
import { useForm } from "react-final-form";
import { DaemonContext } from "../providers/ServiceProviders";
import { formFieldsMapper } from "../mappers/TrainModelFormMappers";
import { theme } from "../providers/MorphwareTheme";
import { makeStyles } from "@material-ui/core";
import PositionedSnackbar from "./PositionedSnackbar";
import { snackBarProps } from "../components/PositionedSnackbar";
import FileField from "./FileField";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const window: any;
export type FileListProps = Array<FileProps>;
interface FileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  buttonText: string;
  acceptedValues: Array<string>;
  removeFilesSignal: boolean;
}
interface FileProps extends File {
  path: string;
}
export interface formFields {
  jupyterNotebook: FileListProps;
  trainingData: FileListProps;
  testingData: FileListProps;
  stopTraining: string;
  stopTrainingAutomatic: string;
  trainingTime: number;
  errorRate: number;
  biddingTime: number;
  workerReward: number;
  testModel: string;
}
interface formFieldsErrors {
  jupyterNotebook: string;
  trainingData: string;
  testingData: string;
  stopMethod: string;
  autoStopMethod: string;
  trainingEstimate: string;
  errorRate: string;
  biddingTime: string;
  bounty: string;
  testModel: string;
}

const TrainModelForm = () => {
  const daemonService = useContext(DaemonContext);
  const [removeFilesSignal, setRemoveFilesSignal] = useState<boolean>(true);
  const [snackBarProps, setSnackBarProps] = useState<snackBarProps>({});

  const onSubmit = async (values: formFields) => {
    const formFields = formFieldsMapper(values);
    const responseV2 = await daemonService.submitTrainModelRequest(formFields);

    if (Object.keys(responseV2).includes("status")) {
      setSnackBarProps({
        text: `Training request recieved. JobID: ${responseV2.job}`,
        severity: "success",
      });
    } else if (Object.keys(responseV2).includes("error")) {
      setSnackBarProps({
        //TODO: Update when failed requests return error message
        text: `${responseV2.error}`,
        severity: "error",
      });
    }

    await daemonService.getTorrents();
    await daemonService.getWalletHistory();
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values: formFields) => {
        const errors = {} as formFieldsErrors;

        if (!values.jupyterNotebook) {
          errors.jupyterNotebook = "Required";
        }
        if (!values.trainingData) {
          errors.trainingData = "Required";
        }
        if (!values.testingData) {
          errors.testingData = "Required";
        }
        if (!values.testModel) {
          errors.testModel = "Required";
        }
        if (values.biddingTime <= 0) {
          errors.biddingTime = "Must be greater than 0";
        }
        if (values.trainingTime <= 0) {
          errors.trainingEstimate = "Must be greater than 0";
        }
        if (values.errorRate <= 0) {
          errors.errorRate = "Must be greater than 0";
        }
        if (values.workerReward <= 0) {
          errors.bounty = "Must be greater than 0";
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
            {snackBarProps.text && snackBarProps.severity && (
              <PositionedSnackbar
                text={snackBarProps.text}
                severity={snackBarProps.severity}
                setSnackBarProps={setSnackBarProps}
              />
            )}
            <Paper
              style={{
                padding: 30,
                height: "fit-content",
                width: "100%",
                backgroundColor: theme.formSectionBackground?.main,
                marginBottom: 50,
              }}
              elevation={3}
            >
              <FileField
                name="jupyterNotebook"
                buttonText="Upload your Jupyter Notebook"
                acceptedValues={[".py", " .ipymb"]}
                removeFilesSignal={removeFilesSignal}
              />

              <FileField
                name="trainingData"
                buttonText="Upload your Training Data"
                acceptedValues={[".gzip", " .tar.bs", " .tar.gz", " .zip"]}
                removeFilesSignal={removeFilesSignal}
              />
              <FileField
                name="testingData"
                buttonText="Upload your Testing Data"
                acceptedValues={[".gzip", " .tar.bs", " .tar.gz", " .zip"]}
                removeFilesSignal={removeFilesSignal}
              />
            </Paper>
            <Paper
              style={{
                padding: 30,
                width: "100%",
                backgroundColor: theme.formSectionBackground?.main,
              }}
              elevation={3}
            >
              <Grid container alignItems="flex-start" spacing={2}>
                {/* <Grid item xs={4} style={{ textAlign: "start" }}>
                    <Typography variant="h6">
                      How will your model stop training?
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Radios
                      name="stopTraining"
                      required={true}
                      gridSize={6}
                      color="primary"
                      data={[
                        {
                          label: "Early stopping (automatic)",
                          value: "early_stopping",
                        },
                        {
                          label: "Active monitoring (manual)",
                          value: "active_monitoring",
                        },
                      ]}
                    />
                  </Grid> */}
                <Grid item xs={4} style={{ textAlign: "start" }}>
                  <Typography variant="h6">
                    How will it stop training?
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Radios
                    name="stopTrainingAutomatic"
                    required={true}
                    gridSize={6}
                    color="primary"
                    data={[
                      {
                        label: "Error rate will reach a threshold value",
                        value: "threshold_value",
                      },
                      {
                        label: "Error rate will stop meaningfully decreasing",
                        value: "threshold_slope",
                      },
                      {
                        label: "Maximum number of epochs (not fallback)",
                        value: "max_num_epochs",
                      },
                      { label: "Other", value: "other" },
                    ]}
                  />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "start" }}>
                  <Typography variant="h6">Job Specification</Typography>
                </Grid>
                <Grid container />
                <Grid container xs={8} spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Training Time (estimate)"
                      name="trainingTime"
                      required={true}
                      type="number"
                      style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Error Rate"
                      name="errorRate"
                      required={true}
                      type="number"
                      style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Bidding Time"
                      name="biddingTime"
                      required={true}
                      type="number"
                      style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Bounty"
                      name="workerReward"
                      type="number"
                      required={true}
                      style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Radios
                    name="testModel"
                    required={true}
                    gridSize={7}
                    color="primary"
                    data={[
                      {
                        label: "Test Model",
                        value: "yes",
                      },
                      {
                        label: "Do not Test Model",
                        value: "no",
                      },
                    ]}
                  />
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
                    setRemoveFilesSignal(!removeFilesSignal);
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
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
            <Grid item style={{ marginTop: 16 }}></Grid>
          </Grid>
        </form>
      )}
    />
  );
};

export default TrainModelForm;

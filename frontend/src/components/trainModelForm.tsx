import React, { useState, useContext, useEffect } from "react";
import { Form } from "react-final-form";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { TextField } from "mui-rff";
import { Radios } from "./Radios";
import { DaemonContext } from "../providers/ServiceProviders";
import { formFieldsMapper } from "../mappers/TrainModelFormMappers";
import { theme } from "../providers/MorphwareTheme";
import FileField from "./FileField";
import { Switches } from "mui-rff";
import { bountySetter } from "./Util";
import { FormApi } from "final-form";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const window: any;
export type FileListProps = Array<FileProps>;

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
  testModel: boolean;
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

interface ITrainModelForm {
  setSendingRequest: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICalculatedBounty {
  form: FormApi<formFields, Partial<formFields>>;
  bounty?: number;
  setBounty: React.Dispatch<React.SetStateAction<number>>;
}

const CalculatedBounty = ({ form, bounty, setBounty }: ICalculatedBounty) => {
  useEffect(() => {
    setBounty(bountySetter(form.getState().values.trainingTime));
  }, [form.getState().values.trainingTime]);

  console.log("BOUNTY: ", bounty);

  return (
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
        value={bounty}
        focused
      />
    </Grid>
  );
};

const TrainModelForm = ({ setSendingRequest }: ITrainModelForm) => {
  const daemonService = useContext(DaemonContext);
  const [removeFilesSignal, setRemoveFilesSignal] = useState<boolean>(true);
  const [bounty, setBounty] = useState<number>(0);

  const onSubmit = async (values: formFields) => {
    setSendingRequest(true);
    values.biddingTime = 60;
    values.testModel = true;
    values.workerReward = bounty;
    values.stopTrainingAutomatic = "max_num_epochs";
    console.log("Values Before: ", values);
    const formFields = formFieldsMapper(values);
    console.log("Values After: ", formFields);

    const responseV2 = await daemonService.submitTrainModelRequest(formFields);

    if (Object.keys(responseV2).includes("status")) {
      daemonService.updateSnackbarProps({
        text: `Training request recieved. JobID: ${responseV2.job}`,
        severity: "success",
      });
    } else if (Object.keys(responseV2).includes("error")) {
      //TODO: Update when failed requests return error message
      daemonService.updateSnackbarProps({
        text: `${responseV2.error}`,
        severity: "error",
      });
    }

    await daemonService.getTorrents();
    await daemonService.getWalletHistory();
    setSendingRequest(false);
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values: formFields) => {
        console.log("VALUES: ", values);

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
        if (values.biddingTime <= 0) {
          errors.biddingTime = "Must be greater than 0";
        }
        if (values.trainingTime <= 0) {
          errors.trainingEstimate = "Must be greater than 0";
        }
        if (values.errorRate <= 0) {
          errors.errorRate = "Must be greater than 0";
        }
        if (values.errorRate >= 100) {
          errors.errorRate = "Must be less than 100";
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
            <Paper
              style={{
                padding: 30,
                height: "fit-content",
                width: "100%",
                backgroundColor: theme.formSectionBackground?.main,
                marginBottom: 50,
              }}
              elevation={0}
            >
              {console.log("FormValues: ", form.getState().values.trainingTime)}
              <FileField
                name="jupyterNotebook"
                buttonText="Upload your Jupyter Notebook"
                acceptedValues={[".py", " .ipynb", ""]}
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
              elevation={0}
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
                        checked: true,
                      },
                    ]}
                    value="max_num_epochs"
                    defaultValue="max_num_epochs"
                    radioGroupProps={{ defaultValue: "max_num_epochs" }}
                  />
                </Grid>
                <Grid item xs={4} style={{ textAlign: "start" }}>
                  <Typography variant="h6">Job Specification</Typography>
                </Grid>
                <Grid container />
                <Grid container xs={8} spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Training Time (h) (estimate)"
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
                      label="Acceptable Accuracy"
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
                      label="Bidding Tim (m)"
                      name="biddingTime"
                      required={true}
                      type="number"
                      value={4}
                      style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    />
                  </Grid>
                  <CalculatedBounty
                    form={form}
                    bounty={bounty}
                    setBounty={setBounty}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Switches
                    label="Test Model"
                    name="testModel"
                    data={{ label: "", value: true }}
                    checked={true}
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { theme } from "../providers/MorphwareTheme";
import { TextField } from "mui-rff";
import { Form } from "react-final-form";
import { Radios } from "./Radios";
import { Switches, SwitchData } from "mui-rff";

const SettingsForm = () => {
  return (
    <div>
      <Form
        onSubmit={() => {}}
        validate={() => {
          return {};
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
                  <Grid item xs={4} style={{ textAlign: "start" }}>
                    <Typography variant="h6">Settings</Typography>
                  </Grid>
                  <Grid container xs={8} spacing={2}>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                      <TextField
                        label="Data Path"
                        name="dataPath"
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
                        label="Torrent Listening Port"
                        name="torrentListenPort"
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
                      <Switches
                        name="acceptWork"
                        required={true}
                        data={{ label: "Accept Work", value: true }}
                      />
                      {/* @ts-expect-error  */}
                      <input directory="" webkitdirectory="" type="file" />
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { Field, useForm } from "react-final-form";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { ThemeProps } from "../providers/MorphwareTheme";
import { formatFileSize } from "../utils";

interface FileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  buttonText: string;
  acceptedValues: Array<string>;
  removeFilesSignal: boolean;
  webkitdirectory?: boolean;
  directory?: boolean;
}

const styles = makeStyles((theme: ThemeProps) => {
  return {
    removeFileIcon: {
      "&:hover": {
        curser: "pointer",
      },
    },
    metaDataContainer: {
      width: "100%",
      height: "80%",
      border: `1px solid ${theme.metaDataContainer?.main}`,
    },
    metaDataText: {
      color: theme.text?.main,
    },
  };
});

const FileField = ({
  name,
  buttonText,
  acceptedValues,
  removeFilesSignal,
  webkitdirectory = false,
  directory = false,
  ...props
}: FileFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const accept = acceptedValues ? acceptedValues.join(",") : "*";
  const form = useForm();
  const theme = useTheme();
  const classes = styles(theme);

  const fileName = (files?: FileList | null) => {
    const fileName = fileUploaded && files?.length === 1 ? files[0].name : "";
    const truncatedFileName =
      fileName.length <= 15 ? fileName : fileName.substring(0, 25) + "...";
    return truncatedFileName;
  };

  const fileSize = (files?: FileList | null) => {
    return fileUploaded && files?.length === 1
      ? formatFileSize(files[0].size)
      : "";
  };

  const lastModified = (files?: FileList | null) => {
    if (!files) return "";
    const lastModified = new Date(files[0].lastModified);
    return lastModified.toUTCString();
  };

  const removeUploadedFile = () => {
    if (inputRef.current?.files) {
      inputRef.current.value = "";
      setFileUploaded(false);
      form.change(name, undefined);
    }
  };

  useEffect(() => {
    if (fileUploaded && inputRef.current?.files?.length === 1) {
      removeUploadedFile();
    }
  }, [removeFilesSignal]);

  const FileMetaData = () => {
    if (fileUploaded && inputRef.current?.files?.length === 1) {
      const theme: ThemeProps = useTheme();
      const classes = styles(theme);

      return (
        <>
          <Grid item xs={7}>
            <Grid container xs={12} className={classes.metaDataContainer}>
              <Grid
                item
                xs={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" className={classes.metaDataText}>
                  {fileName(inputRef.current?.files)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" className={classes.metaDataText}>
                  {fileSize(inputRef.current?.files)}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" className={classes.metaDataText}>
                  {lastModified(inputRef.current?.files)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Box
              display="flex"
              justifyContent="flex-end"
              style={{ height: "100%" }}
              alignItems="center"
              alignContent="center"
            >
              <IconButton
                className={classes.removeFileIcon}
                aria-label="delete"
                onClick={removeUploadedFile}
              >
                <HighlightOffIcon
                  fontSize="large"
                  color="secondary"
                  className={classes.metaDataText}
                />
              </IconButton>
            </Box>
          </Grid>
        </>
      );
    }
    return <Grid item className="empty" xs={8} />;
  };

  return (
    <Grid
      container
      spacing={2}
      xs={12}
      style={{ minHeight: "80px", height: "7vh" }}
    >
      <Field<FileList> name={name}>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {({ input: { value, onChange, ...input } }) => (
          <>
            <Grid item xs={4} alignItems="center">
              <FormControl
                required={true}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <input
                  // webkitdirectory={webkitdirectory ? "" : false}
                  // directory={directory ? "" : false}
                  {...input}
                  type="file"
                  style={{ display: "none" }}
                  onChange={({ target }) => {
                    onChange(target.files);
                    setFileUploaded(true);
                  }}
                  {...props}
                  id={`${name}-html-for`}
                  ref={inputRef}
                  onClick={() => setFileUploaded(true)}
                  accept={accept}
                />
                <label
                  htmlFor={`${name}-html-for`}
                  style={{ height: "100%", width: "80%" }}
                >
                  <Button
                    style={{ width: "100%", display: "flex", height: "50px" }}
                    component="span"
                    variant="contained"
                    // variant="outlined"
                    color="primary"
                  >
                    {buttonText}
                  </Button>
                </label>
              </FormControl>
            </Grid>
            {fileUploaded ? (
              <FileMetaData />
            ) : (
              <Grid item className="empty" xs={8} />
            )}
          </>
        )}
      </Field>
    </Grid>
  );
};

export default FileField;

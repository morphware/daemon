/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from "react";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Radio as MuiRadio,
  RadioProps as MuiRadioProps,
  RadioGroup,
  RadioGroupProps,
  Grid,
  GridSize,
  Box,
  useTheme,
  makeStyles,
  Typography,
} from "@material-ui/core";

import {
  ErrorMessage,
  ShowErrorFunc,
  showErrorOnChange,
  useFieldForErrors,
} from "./Util";
import { Field, FieldProps } from "react-final-form";
import { ThemeProps } from "../providers/MorphwareTheme";

export interface RadioData {
  label: ReactNode;
  value: unknown;
  disabled?: boolean;
  checked?: boolean;
}

export interface RadiosProps extends Partial<Omit<MuiRadioProps, "onChange">> {
  name: string;
  data: RadioData[];
  gridSize: GridSize;
  label?: ReactNode;
  required?: boolean;
  helperText?: string;
  formLabelProps?: Partial<FormLabelProps>;
  formControlLabelProps?: Partial<FormControlLabelProps>;
  fieldProps?: Partial<FieldProps<any, any>>;
  formControlProps?: Partial<FormControlProps>;
  radioGroupProps?: Partial<RadioGroupProps>;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  showError?: ShowErrorFunc;
}

const styles = makeStyles((theme: ThemeProps) => {
  return {
    radioLabel: {
      color: theme.text?.main,
    },
  };
});

export function Radios(props: RadiosProps) {
  const {
    name,
    data,
    gridSize,
    label,
    required,
    helperText,
    formLabelProps,
    formControlLabelProps,
    fieldProps,
    formControlProps,
    radioGroupProps,
    formHelperTextProps,
    showError = showErrorOnChange,
    ...restRadios
  } = props;

  const field = useFieldForErrors(name);
  const isError = showError(field);
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <FormControl
      required={required}
      error={isError}
      {...formControlProps}
      style={{ display: "block" }}
    >
      {!!label && (
        <FormLabel {...formLabelProps} style={{ color: "red" }}>
          {label}
        </FormLabel>
      )}
      <RadioGroup {...radioGroupProps} style={{ display: "block" }}>
        <Grid container xs={12}>
          {data.map((item: RadioData, idx: number) => (
            <Grid item key={idx} xs={gridSize} justifyContent="flex-start">
              <Box display="flex">
                <FormControlLabel
                  name={name}
                  label={
                    <Typography className={classes.radioLabel}>
                      {item.label}
                    </Typography>
                  }
                  value={item.value}
                  disabled={item.disabled}
                  control={
                    <Field
                      name={name}
                      type="radio"
                      render={({
                        input: { name, value, onChange, checked, ...restInput },
                      }) => (
                        <MuiRadio
                          name={name}
                          value={value}
                          onChange={onChange}
                          checked={item.checked ? true : checked}
                          disabled={item.disabled}
                          required={required}
                          inputProps={{ required, ...restInput }}
                          {...restRadios}
                        />
                      )}
                      {...fieldProps}
                    />
                  }
                  {...formControlLabelProps}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
      <ErrorMessage
        showError={isError}
        meta={field.meta}
        formHelperTextProps={formHelperTextProps}
        helperText={helperText}
      />
    </FormControl>
  );
}

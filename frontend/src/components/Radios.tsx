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
} from "@material-ui/core";

import {
  ErrorMessage,
  ShowErrorFunc,
  showErrorOnChange,
  useFieldForErrors,
} from "./Util";
import { Field, FieldProps } from "react-final-form";

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

  return (
    <FormControl
      required={required}
      error={isError}
      {...formControlProps}
      style={{ display: "block" }}
    >
      {!!label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
      <RadioGroup {...radioGroupProps} style={{ display: "block" }}>
        <Grid container xs={12}>
          {data.map((item: RadioData, idx: number) => (
            <Grid item key={idx} xs={gridSize} justifyContent="flex-start">
              <Box display="flex">
                <FormControlLabel
                  name={name}
                  label={item.label}
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

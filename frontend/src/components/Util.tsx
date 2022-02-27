import React from "react";
import { FieldMetaState, useField } from "react-final-form";
import { FormHelperText, FormHelperTextProps } from "@material-ui/core";

export interface ErrorMessageProps {
  showError: boolean;
  meta: FieldMetaState<any>;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  helperText?: string;
}

export function ErrorMessage({
  showError,
  meta,
  formHelperTextProps,
  helperText,
}: ErrorMessageProps) {
  if (showError) {
    return (
      <FormHelperText {...formHelperTextProps}>
        {meta.error || meta.submitError}
      </FormHelperText>
    );
  } else if (helperText) {
    return (
      <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
    );
  } else {
    return <></>;
  }
}

export type ShowErrorFunc = (props: ShowErrorProps) => boolean;

export interface ShowErrorProps {
  meta: FieldMetaState<any>;
}

const config = {
  subscription: {
    error: true,
    submitError: true,
    dirtySinceLastSubmit: true,
    touched: true,
    modified: true,
  },
};

export const useFieldForErrors = (name: string) => useField(name, config);

export const showErrorOnChange: ShowErrorFunc = ({
  meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
}: ShowErrorProps) =>
  !!(
    ((submitError && !dirtySinceLastSubmit) || error) &&
    (touched || modified)
  );

export const showErrorOnBlur: ShowErrorFunc = ({
  meta: { submitError, dirtySinceLastSubmit, error, touched },
}: ShowErrorProps) =>
  !!(((submitError && !dirtySinceLastSubmit) || error) && touched);

export const bountySetter = (
  MWTPrice?: string,
  estimatedTrainingTime?: number
) => {
  if (!estimatedTrainingTime) return 0;
  if (!MWTPrice) throw "MWTPrice is not defined";
  //Assuming the average worker has a 2080;
  const CUDACores = 2944;

  //The average EC2 instance ($ CUDA Core / h) with the closest amount of CUDA Cores
  const CUDACorePerHour = 0.00018310546875;

  const estimatedBountyUSD =
    CUDACorePerHour * CUDACores * estimatedTrainingTime;
  const estimatedBountyMWT = estimatedBountyUSD / parseFloat(MWTPrice);

  return Math.round(estimatedBountyMWT);
};

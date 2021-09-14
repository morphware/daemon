import { formFields } from "../components/trainModelForm";

export interface ITrainingModelValuesV2 {
  jupyterNotebook: string;
  trainingData: string;
  testingData: string;
  stopTraining: string;
  stopTrainingAutomatic: string;
  trainingTime: number;
  errorRate: number;
  biddingTime: number;
  workerReward: number;
  testModel: boolean;
}

export const formFieldsMapper = (fields: formFields) => {
  const formFieldsDto = {} as ITrainingModelValuesV2;

  formFieldsDto.jupyterNotebook = fields.jupyterNotebook[0].path;
  formFieldsDto.trainingData = fields.trainingData[0].path;
  formFieldsDto.testingData = fields.testingData[0].path;
  formFieldsDto.stopTraining = "active_monitoring";
  formFieldsDto.stopTrainingAutomatic = fields.stopTrainingAutomatic;
  formFieldsDto.trainingTime = fields.trainingTime;
  formFieldsDto.biddingTime = fields.biddingTime;
  formFieldsDto.errorRate = fields.errorRate;
  formFieldsDto.workerReward = fields.workerReward;
  formFieldsDto.testModel = fields.testModel === "yes" ? true : false;
  return formFieldsDto;
};

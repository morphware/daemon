import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";
export interface IDaemonService {
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
}

export class DaemonService implements IDaemonService {
  private readonly baseUrl: string = "http://127.0.0.1:3001";

  constructor() {}

  public submitTrainModelRequest = async (
    trainModelRequest: ITrainingModelValuesV2
  ): Promise<void> => {
    const url = `${this.baseUrl}/api/v0/contract`;

    console.log("request: ", trainModelRequest);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainModelRequest),
    };

    await fetch(url, requestOptions);
  };
}

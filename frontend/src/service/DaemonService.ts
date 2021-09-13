import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";

interface TorrentData {
  name: string;
  progress: number;
  downloadSpeed: number;
  numPeers: number;
  timeRemaining: number;
  magnetURI: string;
}

export interface ActiveTorrents {
  download: number;
  upload: number;
  port: number;
  torrents: Array<TorrentData>;
}

export interface IDaemonService {
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
  getActiveTorrents(): Promise<ActiveTorrents>;
}
export class DaemonService implements IDaemonService {
  private readonly baseUrl: string = "http://127.0.0.1:3000";

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

  public getActiveTorrents = async (): Promise<ActiveTorrents> => {
    const url = `${this.baseUrl}/api/V0/torrent`;
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    console.log("Response: ", response);
    const torrentData: ActiveTorrents = await response.json();
    console.log("Response2: ", torrentData);

    return torrentData;
  };
}

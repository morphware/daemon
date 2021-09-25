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

export interface WalletBalanceProps {
  balance: string;
  address: string;
}

export interface TransactionProps {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: Array<string>;
  transactionHash: string;
  transactionIndex: number;
  id: string;
  returnValues: {
    0: string;
    1: string;
    2: string;
    __length__: number;
    from: string;
    to: string;
    value: string;
  };
}

export interface WalletHistoryProps {
  transactions: Array<TransactionProps>;
  address: string;
}

export interface SendMWTRequestProps {
  address: string;
  amount: string;
  gas?: string;
}

interface ConnectionStatusProps {
  status: boolean;
  network: string;
}

export interface SubmitTrainingModelResponse {
  error?: string;
  status: string;
  job: string;
}

export interface SettingsParamsResponseProps {
  conf: any;
  editKeys: {
    httpBindAddress: string;
    httpPort: string;
    privateKey: string;
    acceptWork: string;
    torrentListenPort: string;
    appDownloadPath: string;
  };
}

export interface SettingsRequestProps {
  httpBindAddress?: string;
  httpPort?: string;
  privateKey?: string;
  acceptWork?: boolean;
  torrentListenPort?: number;
  appDownloadPath?: string;
}

export interface SettingsResponseProps extends SettingsRequestProps {
  error?: any;
}

export interface IDaemonService {
  submitTrainModelRequest(
    modelRequest: ITrainingModelValuesV2
  ): Promise<SubmitTrainingModelResponse>;
  getActiveTorrents(): Promise<ActiveTorrents>;
  getMWTBalance(): Promise<WalletBalanceProps>;
  getWalletHistory(): Promise<WalletHistoryProps>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<TransactionProps>;
  getConnectionStatus(): Promise<ConnectionStatusProps>;
  getSettings(): Promise<SettingsParamsResponseProps>;
  updateSettings(
    requestValues: SettingsRequestProps
  ): Promise<SettingsResponseProps>;
  getCurrentSettings(): Promise<SettingsResponseProps>;
}
export class DaemonService implements IDaemonService {
  private readonly baseUrl: string =
    "http://" + (window.localStorage.getItem("url") || "127.0.0.1:3001");

  constructor() {}

  public getConnectionStatus = async (): Promise<ConnectionStatusProps> => {
    const url = `${this.baseUrl}/api/V0/network`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const status: ConnectionStatusProps = await response.json();

    return status;
  };

  public sendMWT = async (
    sendMWTRequest: SendMWTRequestProps
  ): Promise<any> => {
    const url = `${this.baseUrl}/api/V0/wallet/send`;

    console.log("sendMWT: ", sendMWTRequest);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendMWTRequest),
    };

    const response = await fetch(url, requestOptions);
    const transaction: TransactionProps = await response.json();
    return transaction;
  };

  public getWalletHistory = async (): Promise<WalletHistoryProps> => {
    const url = `${this.baseUrl}/api/v0/wallet/history`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const history: WalletHistoryProps = await response.json();

    return history;
  };

  public getMWTBalance = async (): Promise<WalletBalanceProps> => {
    const url = `${this.baseUrl}/api/v0/wallet`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const balance: WalletBalanceProps = await response.json();

    return balance;
  };

  public submitTrainModelRequest = async (
    trainModelRequest: ITrainingModelValuesV2
  ): Promise<SubmitTrainingModelResponse> => {
    const url = `${this.baseUrl}/api/v0/contract`;

    console.log("submitTrainModelRequest: ", trainModelRequest);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainModelRequest),
    };

    const response = await fetch(url, requestOptions);
    const trainModelResponse: SubmitTrainingModelResponse =
      await response.json();
    return trainModelResponse;
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

    return torrentData;
  };

  public getSettings = async (): Promise<SettingsParamsResponseProps> => {
    const url = `${this.baseUrl}/api/v0/settings`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const settingsConfig: SettingsParamsResponseProps = await response.json();

    console.log("settings: ", settingsConfig);

    return settingsConfig;
  };

  public getCurrentSettings = async (): Promise<SettingsResponseProps> => {
    const url = `${this.baseUrl}/api/v0/settings`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const currentSettings: SettingsResponseProps = await response.json();

    return currentSettings;
  };

  public updateSettings = async (
    requestValues: SettingsRequestProps
  ): Promise<SettingsResponseProps> => {
    const url = `${this.baseUrl}/api/v0/settings`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestValues),
    };

    console.log("updateSettings: ", requestValues);

    const response = await fetch(url, requestOptions);
    const updatedSettingsResponse: SettingsResponseProps =
      await response.json();

    return updatedSettingsResponse;
  };
}

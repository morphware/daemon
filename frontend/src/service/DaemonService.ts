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

export interface JobTransactionProps {
  address: string;
  blockHash: string;
  blockNumber: number;
  logIndex: number;
  removed: boolean;
  transactionHash: string;
  transactionIndex: number;
  id: string;
  event: string;
  signature: string;
  cumulativeGasUsed?: number;
  effectiveGasPrice?: string;
  gasUsed?: number;
  logsBloom?: string;
  status?: boolean;
  to?: string;
  contractAddress?: string | null;
  from?: string;
  type?: string;

  raw: {
    data: string;
    topics: Array<string>;
  };
  returnValues: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    id: string;
    jobPoster: string;
    auctionAddress: string;
    estimatedTrainingTime: string;
    trainingDatasetSize: string;
    workerReward: string;
    biddingDeadline: string;
    revealDeadline: string;
    __length__?: number;
    from?: string;
    to?: string;
    value?: string;
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
  conf: {
    version: string;
  };
  editKeys: {
    httpBindAddress: string;
    httpPort: string;
    privateKey: string;
    torrentListenPort: string;
    appDownloadPath: string;
    miningCommand: string;
  };
}

export interface SettingsRequestProps {
  httpBindAddress?: string;
  httpPort?: string;
  privateKey?: string;
  torrentListenPort?: number;
  appDownloadPath?: string;
  jupyterLabPort?: number;
  miningCommand?: string;
  workerGPU?: string;
  role?: string;
}

interface trainModelPostDataResponse {
  jupyterNotebook: string;
  trainingData: string;
  testingData: string;
  stopMethod: string;
  autoStopMethod: string;
  trainingTime: string;
  errorRate: string;
  biddingTime: string;
  workerReward: string;
  testModel: boolean;
  files: {
    jupyterNotebook: {
      path: string;
      magnetURI: string;
    };
    trainingData: {
      path: string;
      magnetURI: string;
    };
    testingData: {
      path: string;
      magnetURI: string;
    };
  };
}

export interface SettingsResponseProps extends SettingsRequestProps {
  error?: any;
}

export interface jobProps {
  instanceID: string;
  id: string;
  type: string;
  wallet: string;
  postData?: trainModelPostDataResponse;
  status: string;
  transactions: Array<JobTransactionProps>;
  jobData: {
    auctionAddress: string;
    biddingDeadline: string;
    revealDeadline: string;
    estimatedTrainingTime: string;
    id: string;
    jobPoster: string;
    trainingDatasetSize: string;
    workerReward: string;
  };
}

export interface ActiveJobsProps {
  canTakeWork: boolean;
  jobs: {
    [property: string]: jobProps;
  };
}

export interface ClientRole {
  role: string;
}

export interface MWTPrice {
  price: string;
}

export interface IDaemonService {
  getMWTPrice(): Promise<string>
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
  startJupyterLab(): Promise<any>
  getUserRole(): Promise<ClientRole>
}
export class DaemonService implements IDaemonService {
  private readonly baseUrl: string =
    "http://" + (window.localStorage.getItem("url") || "127.0.0.1:3001");

  constructor() {}

  public getMWTPrice = async (): Promise<string> => {
     const url = `${this.baseUrl}/api/V0/wallet/price`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const MWTPrice: MWTPrice = await response.json();
    return MWTPrice.price;
  }

  public getUserRole = async (): Promise<ClientRole> => {
    const url = `${this.baseUrl}/api/V0/settings/role`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const activeJobs: ClientRole = await response.json();
    return activeJobs;
  }

  public getTrackedJobs = async (): Promise<ActiveJobsProps> => {
    const url = `${this.baseUrl}/api/V0/job`;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const activeJobs: ActiveJobsProps = await response.json();
    return activeJobs;
  };

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

    const response = await fetch(url, requestOptions);
    const updatedSettingsResponse: SettingsResponseProps =
      await response.json();

    return updatedSettingsResponse;
  };

  public startJupyterLab = async () => {
    const url = `${this.baseUrl}/api/v0/notebook/start`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const startJupyterLabResponse = await response.json();
    return startJupyterLabResponse;
  }

  public startMiner = async () => {
    const url = `${this.baseUrl}/api/v0/miner/start`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const startLocalMinerResponse = await response.json();
    return startLocalMinerResponse;
  }
  
  public stopMiner = async () => {
    const url = `${this.baseUrl}/api/v0/miner/stop`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, requestOptions);
    const stopLocalMinerResponse = await response.json();
    return stopLocalMinerResponse;
  }
}

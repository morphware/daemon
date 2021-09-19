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

//TODO: write out entire transaction interface
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
}
export interface IDaemonService {
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
  getActiveTorrents(): Promise<ActiveTorrents>;
  getMWTBalance(): Promise<WalletBalanceProps>;
  getWalletHistory(): Promise<WalletHistoryProps>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<TransactionProps>;
  getConnectionStatus(): Promise<ConnectionStatusProps>;
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

    console.log("status: ", status);

    return status;
  };

  public sendMWT = async (
    sendMWTRequest: SendMWTRequestProps
  ): Promise<any> => {
    const url = `${this.baseUrl}/api/V0/wallet/send`;

    console.log("Url: ", url);
    console.log("Body: ", sendMWTRequest);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendMWTRequest),
    };

    const response = await fetch(url, requestOptions);
    const transaction: TransactionProps = await response.json();

    // console.log("response: ", response);
    console.log("transaction: ", transaction);

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
    console.log("History: ", history);

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
    console.log("Balance: ", balance);

    return balance;
  };

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

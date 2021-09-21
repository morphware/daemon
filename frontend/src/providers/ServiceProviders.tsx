/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";
import {
  ActiveTorrents,
  DaemonService,
  SendMWTRequestProps,
  SubmitTrainingModelResponse,
  WalletBalanceProps,
  WalletHistoryProps,
} from "../service/DaemonService";
import Web3 from "web3";
export const DaemonContext = React.createContext({} as daemonServiceProps);

// interface trainingModel

interface daemonServiceProps {
  MWTAddress: string;
  daemonService: DaemonService;
  torrents?: ActiveTorrents;
  walletBalance?: string;
  walletHistory?: WalletHistoryProps;
  walletAddress?: string;
  connectionStatus: boolean;
  network?: string;
  getTorrents: () => Promise<void>;
  submitTrainModelRequest(
    modelRequest: ITrainingModelValuesV2
  ): Promise<SubmitTrainingModelResponse>;
  getBalance(): Promise<void>;
  getWalletHistory(): Promise<void>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<void>;
  getConnectionStatus(): Promise<void>;
}

const MWSBalance = "0xbc40e97e6d665ce77e784349293d716b030711bc";

const ServiceProviders: React.FC = ({ children }) => {
  const daemonService = new DaemonService();
  const [torrents, setTorrents] = useState<ActiveTorrents>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [walletBalance, setWalletBalance] = useState<string>();
  const [walletHistory, setWalletHistory] = useState<WalletHistoryProps>();
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>();

  const mockTorrents = () => {
    const mockTorrents: ActiveTorrents = {
      download: 10,
      port: 3001,
      upload: 10,
      torrents: [
        {
          name: "jupyter-notebook.ipymb",
          progress: 13,
          downloadSpeed: 23,
          numPeers: 51,
          timeRemaining: 21,
          magnetURI:
            "magnet:?xt=urn:btih:f35be570c19b5e026930e97a9533ac7207f960a4&dn=jupyter-notebook.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
        },
        {
          name: "training-data.html",
          progress: 42,
          downloadSpeed: 74,
          numPeers: 74,
          timeRemaining: 25,
          magnetURI:
            "magnet:?xt=urn:btih:7948a0c8a8407274fa5bc63219eaa061b495e5db&dn=training-data.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
        },
        {
          name: "testing-data.md",
          progress: 52,
          downloadSpeed: 57,
          numPeers: 47,
          timeRemaining: 32,
          magnetURI:
            "magnet:?xt=urn:btih:c38689c760a42c2f4060935ebfbf6e55d42350f9&dn=testing-data.md&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
        },
      ],
    };
    return mockTorrents;
  };

  const getTorrents = async () => {
    const torrents = await daemonService.getActiveTorrents();
    setTorrents(torrents);
  };

  const getBalance = async () => {
    const walletBalanceProps = await daemonService.getMWTBalance();
    const MWTBalance = Web3.utils.fromWei(
      walletBalanceProps.balance.toString(),
      "ether"
    );
    setWalletBalance(MWTBalance);
    setWalletAddress(walletBalanceProps.address);
  };

  const getWalletHistory = async () => {
    const walletBalanceProps = await daemonService.getWalletHistory();
    setWalletHistory(walletBalanceProps);
  };

  const sendMWT = async (sendMWTRequest: SendMWTRequestProps) => {
    const MWTAmount = Web3.utils.toWei(sendMWTRequest.amount, "ether");
    const newRequest = {} as SendMWTRequestProps;
    newRequest.address = sendMWTRequest.address;
    newRequest.amount = MWTAmount;
    if (sendMWTRequest.gas) {
      newRequest.gas = Web3.utils.toWei(sendMWTRequest.gas, "gwei");
    }
    console.log("Req : ", newRequest);
    const transaction = await daemonService.sendMWT(newRequest);
    return transaction;
  };

  const getConnectionStatus = async () => {
    const statusResponse = await daemonService.getConnectionStatus();
    const status = statusResponse.status;
    const network = statusResponse.network;
    setConnectionStatus(status);
    setNetwork(network);
  };

  const submitTrainModelRequest = async (values: ITrainingModelValuesV2) => {
    values.workerReward = Web3.utils.toWei(
      values.workerReward.toString(),
      "ether"
    );
    return await daemonService.submitTrainModelRequest(values);
  };

  const daemonServicContext: daemonServiceProps = {
    MWTAddress: MWSBalance,
    daemonService: daemonService,
    torrents: torrents,
    walletBalance: walletBalance,
    walletHistory: walletHistory,
    walletAddress: walletAddress,
    connectionStatus: connectionStatus,
    network: network,
    getTorrents: getTorrents,
    submitTrainModelRequest: submitTrainModelRequest,
    getBalance: getBalance,
    getWalletHistory: getWalletHistory,
    sendMWT: sendMWT,
    getConnectionStatus: getConnectionStatus,
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await getConnectionStatus();
      await getBalance();
      await getWalletHistory();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getTorrents();
    getBalance();
    getWalletHistory();
  }, []);

  return (
    <DaemonContext.Provider value={daemonServicContext}>
      {children}
    </DaemonContext.Provider>
  );
};

export default ServiceProviders;

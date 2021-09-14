/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";
import {
  ActiveTorrents,
  DaemonService,
  SendMWTRequestProps,
  WalletBalanceProps,
  WalletHistoryProps,
} from "../service/DaemonService";

export const DaemonContext = React.createContext({} as daemonServiceProps);

interface daemonServiceProps {
  daemonService: DaemonService;
  torrents?: ActiveTorrents;
  walletBalance?: WalletBalanceProps;
  walletHistory?: WalletHistoryProps;
  getTorrents: () => Promise<void>;
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
  getBalance(): Promise<void>;
  getWalletHistory(): Promise<void>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<void>;
}

const ServiceProviders: React.FC = ({ children }) => {
  const daemonService = new DaemonService();
  const [torrents, setTorrents] = useState<ActiveTorrents>();
  const [walletBalance, setWalletBalance] = useState<WalletBalanceProps>();
  const [walletHistory, setWalletHistory] = useState<WalletHistoryProps>();

  const getTorrents = async () => {
    const torrents = await daemonService.getActiveTorrents();
    console.log("getting torernts");
    setTorrents(torrents);
  };

  const getBalance = async () => {
    const walletBalanceProps = await daemonService.getMWTBalance();
    setWalletBalance(walletBalanceProps);
  };

  const getWalletHistory = async () => {
    const walletBalanceProps = await daemonService.getWalletHistory();
    setWalletHistory(walletBalanceProps);
  };

  const sendMWT = async (sendMWTRequest: SendMWTRequestProps) => {
    const transaction = await daemonService.sendMWT(sendMWTRequest);
    return transaction;
  };

  const daemonServicContext: daemonServiceProps = {
    daemonService: daemonService,
    torrents: torrents,
    walletBalance: walletBalance,
    walletHistory: walletHistory,
    getTorrents: getTorrents,
    submitTrainModelRequest: daemonService.submitTrainModelRequest,
    getBalance: getBalance,
    getWalletHistory: getWalletHistory,
    sendMWT: sendMWT,
  };

  useEffect(() => {
    console.log("Getting torrents, balance");
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

const mockTorrents = [
  {
    name: "jupyter-notebook.html",
    progress: 2,
    downloadSpeed: 1,
    numPeers: 12,
    timeRemaining: 32,
    magnetURI:
      "magnet:?xt=urn:btih:f35be570c19b5e026930e97a9533ac7207f960a4&dn=jupyter-notebook.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
  },
  {
    name: "training-data.html",
    progress: 35,
    downloadSpeed: 3,
    numPeers: 87,
    timeRemaining: 66,
    magnetURI:
      "magnet:?xt=urn:btih:7948a0c8a8407274fa5bc63219eaa061b495e5db&dn=training-data.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
  },
  {
    name: "testing-data.md",
    progress: 54,
    downloadSpeed: 73,
    numPeers: 2,
    timeRemaining: 4,
    magnetURI:
      "magnet:?xt=urn:btih:c38689c760a42c2f4060935ebfbf6e55d42350f9&dn=testing-data.md&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
  },
];

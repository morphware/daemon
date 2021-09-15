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
import Web3 from "web3";
export const DaemonContext = React.createContext({} as daemonServiceProps);

interface daemonServiceProps {
  daemonService: DaemonService;
  torrents?: ActiveTorrents;
  walletBalance?: string;
  walletHistory?: WalletHistoryProps;
  walletAddress?: string;
  connectionStatus: boolean;
  getTorrents: () => Promise<void>;
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
  getBalance(): Promise<void>;
  getWalletHistory(): Promise<void>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<void>;
  getConnectionStatus(): Promise<void>;
}

const ServiceProviders: React.FC = ({ children }) => {
  const daemonService = new DaemonService();
  const [torrents, setTorrents] = useState<ActiveTorrents>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [walletBalance, setWalletBalance] = useState<string>();
  const [walletHistory, setWalletHistory] = useState<WalletHistoryProps>();
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

  const getTorrents = async () => {
    const torrents = await daemonService.getActiveTorrents();
    console.log("getting torernts");
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
    const transaction = await daemonService.sendMWT(sendMWTRequest);
    return transaction;
  };

  const getConnectionStatus = async () => {
    const statusResponse = await daemonService.getConnectionStatus();
    const status = statusResponse.status;
    setConnectionStatus(status);
  };

  const daemonServicContext: daemonServiceProps = {
    daemonService: daemonService,
    torrents: torrents,
    walletBalance: walletBalance,
    walletHistory: walletHistory,
    walletAddress: walletAddress,
    connectionStatus: connectionStatus,
    getTorrents: getTorrents,
    submitTrainModelRequest: daemonService.submitTrainModelRequest,
    getBalance: getBalance,
    getWalletHistory: getWalletHistory,
    sendMWT: sendMWT,
    getConnectionStatus: getConnectionStatus,
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await getConnectionStatus();
      await getBalance();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

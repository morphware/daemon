/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";
import {
  ActiveTorrents,
  DaemonService,
  SendMWTRequestProps,
  SettingsParamsResponseProps,
  SettingsRequestProps,
  SettingsResponseProps,
  SubmitTrainingModelResponse,
  WalletBalanceProps,
  WalletHistoryProps,
} from "../service/DaemonService";
import Web3 from "web3";
import { settingsDaemonResponseToSettingsResponseProps } from "../mappers/SettingsMappers";
export const DaemonContext = React.createContext({} as daemonServiceProps);

interface daemonServiceProps {
  MWTAddress: string;
  daemonService: DaemonService;
  torrents?: ActiveTorrents;
  walletBalance?: string;
  walletHistory?: WalletHistoryProps;
  walletAddress?: string;
  connectionStatus: boolean;
  network?: string;
  currentConfigs?: SettingsResponseProps;
  getTorrents: () => Promise<void>;
  submitTrainModelRequest(
    modelRequest: ITrainingModelValuesV2
  ): Promise<SubmitTrainingModelResponse>;
  getBalance(): Promise<void>;
  getWalletHistory(): Promise<void>;
  sendMWT(sendMWTRequest: SendMWTRequestProps): Promise<void>;
  getConnectionStatus(): Promise<void>;
  updateSettings(
    requestValues: SettingsRequestProps
  ): Promise<SettingsResponseProps>;
  getSettings(): Promise<void>;
  getCurrentSettings(): Promise<void>;
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
  const [currentConfigs, setCurrentConfigs] = useState<SettingsResponseProps>();
  const [configParams, setConfigParams] =
    useState<SettingsParamsResponseProps>();

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

  const sendMWT = async (request: SendMWTRequestProps) => {
    const MWTAmount = Web3.utils.toWei(request.amount, "ether");
    const newRequest = {} as SendMWTRequestProps;
    newRequest.address = request.address;
    newRequest.amount = MWTAmount;
    if (request.gas) {
      newRequest.gas = Web3.utils.toWei(request.gas, "gwei");
    }
    console.log("sendMWT : ", newRequest);
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

  const submitTrainModelRequest = async (request: ITrainingModelValuesV2) => {
    request.workerReward = Web3.utils.toWei(
      request.workerReward.toString(),
      "ether"
    );
    return await daemonService.submitTrainModelRequest(request);
  };

  const updateSettings = async (request: SettingsRequestProps) => {
    console.log("updateSettings: ", request);
    let response = await daemonService.updateSettings(request);
    response = settingsDaemonResponseToSettingsResponseProps(response);
    setCurrentConfigs(response);
    return response;
  };

  const getSettings = async () => {
    const response = await daemonService.getSettings();
    setConfigParams(response);
  };

  const getCurrentSettings = async () => {
    let response = await daemonService.getCurrentSettings();
    response = settingsDaemonResponseToSettingsResponseProps(response);
    console.log("getCurrentSettings: ", response);
    setCurrentConfigs(response);
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
    currentConfigs: currentConfigs,
    getTorrents: getTorrents,
    submitTrainModelRequest: submitTrainModelRequest,
    getBalance: getBalance,
    getWalletHistory: getWalletHistory,
    sendMWT: sendMWT,
    getConnectionStatus: getConnectionStatus,
    updateSettings: updateSettings,
    getSettings: getSettings,
    getCurrentSettings: getCurrentSettings,
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
    getCurrentSettings();
  }, []);

  return (
    <DaemonContext.Provider value={daemonServicContext}>
      {children}
    </DaemonContext.Provider>
  );
};

export default ServiceProviders;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IMinerStats } from "../mappers/MiningStats";
import { DaemonContext } from "./ServiceProviders";

export const UtilsContext = React.createContext({} as utilsProps);

interface utilsProps {
  darkTheme: boolean;
  setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
  mining: {
    currentlyMining: boolean;
    setCurrentlyMining: React.Dispatch<React.SetStateAction<boolean>>;
    miningStats: IMinerStats;
    setMiningStats: React.Dispatch<React.SetStateAction<IMinerStats>>;
    getMiningStatus: () => Promise<void>;
  };
}

const defaultMiningStats: IMinerStats = {
  activeMiningPool: "xxx.xxx.pool",
  id: 0,
  jsonrpc: "2.0",
  memoryTemp: "0",
  nsfminerVersion: "2",
  tempAndFanSpeefPerGPU: [{ fanSpeed: "0", temp: "0" }],
  runningTime: "0",
  eth: {
    hashRateInKhS: "0",
    invalidShares: "0",
    poolSwitches: "0",
    rejectedShares: "0",
    submittedShares: "0",
  },
};

const UtilsProvider: React.FC = ({ children }) => {
  const daemonService = useContext(DaemonContext);
  const darkModeInitially = daemonService.currentConfigs?.darkMode
    ? true
    : false;
  const [darkTheme, setDarkTheme] = useState<boolean>(darkModeInitially);
  const [currentlyMining, setCurrentlyMining] = useState<boolean>(false);
  const [miningStats, setMiningStats] =
    useState<IMinerStats>(defaultMiningStats);

  useEffect(() => {
    setDarkTheme(darkModeInitially);
  }, [darkModeInitially]);

  const getMiningStatus = async () => {
    const isMining = await daemonService.isMining();
    console.log("isMining: ", isMining);
    setCurrentlyMining(isMining);
  };

  const utilsContext: utilsProps = useMemo(() => {
    return {
      darkTheme: darkTheme,
      setDarkTheme: setDarkTheme,
      mining: {
        currentlyMining: currentlyMining,
        setCurrentlyMining: setCurrentlyMining,
        getMiningStatus: getMiningStatus,
        miningStats: miningStats,
        setMiningStats: setMiningStats,
      },
    };
  }, [darkTheme, currentlyMining, miningStats]);

  const getMinerStat = async () => {
    const miningStats = await daemonService.getMinerStats();
    setMiningStats(miningStats);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentlyMining) {
        await getMinerStat();
      }
      await getMiningStatus();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UtilsContext.Provider value={utilsContext}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;

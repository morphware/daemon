/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { ITrainingModelValuesV2 } from "../mappers/TrainModelFormMappers";
import { ActiveTorrents, DaemonService } from "../service/DaemonService";

export const DaemonContext = React.createContext({} as daemonServiceProps);

interface daemonServiceProps {
  daemonService: DaemonService;
  torrents?: ActiveTorrents;
  getTorrents: () => Promise<void>;
  submitTrainModelRequest(modelRequest: ITrainingModelValuesV2): Promise<void>;
}

const ServiceProviders: React.FC = ({ children }) => {
  const daemonService = new DaemonService();
  const [torrents, setTorrents] = useState<ActiveTorrents>();

  const getTorrents = async () => {
    const torrents = await daemonService.getActiveTorrents();
    setTorrents(torrents);
  };

  const daemonServicContext: daemonServiceProps = {
    daemonService: daemonService,
    torrents: torrents,
    getTorrents: getTorrents,
    submitTrainModelRequest: daemonService.submitTrainModelRequest,
  };

  useEffect(() => {
    console.log("Getting torrents");
    getTorrents();
  }, []);

  return (
    <DaemonContext.Provider value={daemonServicContext}>
      {children}
    </DaemonContext.Provider>
  );
};

export default ServiceProviders;

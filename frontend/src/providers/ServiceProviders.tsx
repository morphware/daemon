import React from "react";
import { DaemonService, IDaemonService } from "../service/DaemonService";

export const DaemonContext = React.createContext({} as IDaemonService);

const ServiceProviders: React.FC = ({ children }) => {
  const daemonService = new DaemonService();

  return (
    <DaemonContext.Provider value={daemonService}>
      {children}
    </DaemonContext.Provider>
  );
};

export default ServiceProviders;

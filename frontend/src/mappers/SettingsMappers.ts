import { SettingsResponseProps } from "../service/DaemonService";

//Used to remove previously orphaned edit config keys, or keys that were added through posting directly to daemon through CLI
export const settingsDaemonResponseToSettingsResponseProps = (
  daemonResponse: any
) => {
  const response = {} as SettingsResponseProps;
  if (Object.keys(daemonResponse).includes("privateKey")) {
    response.privateKey = daemonResponse.privateKey;
  }
  if (Object.keys(daemonResponse).includes("appDownloadPath")) {
    response.appDownloadPath = daemonResponse.appDownloadPath;
  }
  if (Object.keys(daemonResponse).includes("torrentListenPort")) {
    response.torrentListenPort = daemonResponse.torrentListenPort;
  }
  if (Object.keys(daemonResponse).includes("jupyterLabPort")) {
    response.jupyterLabPort = daemonResponse.jupyterLabPort;
  }
  if (Object.keys(daemonResponse).includes("workerGPU")) {
    response.workerGPU = daemonResponse.workerGPU;
  }
  if (Object.keys(daemonResponse).includes("role")) {
    response.role = daemonResponse.role;
  }
  if (Object.keys(daemonResponse).includes("darkMode")) {
    response.darkMode = daemonResponse.darkMode;
  }
  if (Object.keys(daemonResponse).includes("trainModels")) {
    response.trainModels = daemonResponse.trainModels;
  }
  return response;
};

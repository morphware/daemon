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
  if (Object.keys(daemonResponse).includes("acceptWork")) {
    response.acceptWork = daemonResponse.acceptWork;
  }
  return response;
};

const JsonRpcMinerStatsToIMinerStats = (jsonRpcMinerStats: any) => {

  const coreStats = jsonRpcMinerStats["result"];

  const minerStats: IMinerStats = {
    id: jsonRpcMinerStats["id"],
    jsonrpc: jsonRpcMinerStats["jsonrpc"],
    activeMiningPool: coreStats[7],
    nsfminerVersion: coreStats[0],
    memoryTemp: coreStats[9].split(";"),
    runningTime: coreStats[1],
    tempAndFanSpeefPerGPU: coreStats[6].split(";"),
    eth: {
      hashRateInKhS: coreStats[2].split(";")[0],
      invalidShares: coreStats[8].split(";")[0],
      poolSwitches: coreStats[8].split(";")[1],
      submittedShares: coreStats[2].split(";")[1],
      rejectedShares: coreStats[2].split(";")[2],
    }
  };

  return minerStats;
};

export interface IMinerStats {
  id: number,
  jsonrpc: string,
  nsfminerVersion: string,
  runningTime: string,
  eth: {
    hashRateInKhS: string,
    submittedShares: string,
    rejectedShares: string,
    invalidShares: string,
    poolSwitches: string
  },
  tempAndFanSpeefPerGPU: Array<tempAndFanSpeed>,
  activeMiningPool: string,
  memoryTemp: string
}



interface tempAndFanSpeed {
  temp: string,
  fanSpeed: string
}


export default JsonRpcMinerStatsToIMinerStats;


module.exports = {
  morphwareTokenABIPath: "MorphwareToken-RopstenABI",
  morphwareTokenContractAddress: "0xbc40e97e6d665ce77e784349293d716b030711bc",

  // https://ropsten.etherscan.io/address/0x78e211873D367D0810F85D817a28f989cB44E168#code
  auctionFactoryABIPath: "VickreyAuction-RopstenABI",
  auctionFactoryContractAddress: "0x78e211873D367D0810F85D817a28f989cB44E168",

  // https://ropsten.etherscan.io/address/0xb0f1F97720790788CD3da27651d2939d55104533#code
  jobFactoryAbiPath: "JobFactory-RopstenABI",
  jobFactoryContractAddress: "0xb0f1F97720790788CD3da27651d2939d55104533",

  ethAddress: "wss://ropsten.infura.io/ws/v3/dc53ba9a23564600bfbe5f8c2f345d1d",
  // ethAddress: 'wss://geth.vm42.us',

  // Turn on chrome dev tools from electron app.
  electronDev: true,

  // Validation Cluster Nodes
  validationNodes: 1,
};

module.exports = {
  morphwareTokenABIPath: "MorphwareToken-RopstenABI",
  morphwareTokenContractAddress: "0xbc40e97e6d665ce77e784349293d716b030711bc",

  // https://ropsten.etherscan.io/address/0x71fc850920c12c1192472957919f1841c50beb60#code
  auctionFactoryABIPath: "VickreyAuction-RopstenABI",
  auctionFactoryContractAddress: "0x71fc850920c12c1192472957919f1841c50beb60",

  // https://ropsten.etherscan.io/address/0xe6dc3945881384b0ed3baadc378c2c6afead9cf2#code
  jobFactoryAbiPath: "JobFactory-RopstenABI",
  jobFactoryContractAddress: "0xe6dc3945881384b0ed3baadc378c2c6afead9cf2",

  ethAddress: "wss://ropsten.infura.io/ws/v3/dc53ba9a23564600bfbe5f8c2f345d1d",
  // ethAddress: 'wss://geth.vm42.us',

  // Turn on chrome dev tools from electron app.
  electronDev: true,

  // Validation Cluster Nodes
  validationNodes: 2,
};

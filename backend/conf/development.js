module.exports = {
  morphwareTokenABIPath: "MorphwareToken-RopstenABI",
  morphwareTokenContractAddress: "0xbc40e97e6d665ce77e784349293d716b030711bc",

  // https://ropsten.etherscan.io/address/0xfd5454dd6556886f9ce12f65ae86343475d23263#code
  auctionFactoryABIPath: "VickreyAuction-RopstenABI",
  auctionFactoryContractAddress: "0xFd5454dd6556886f9ce12F65AE86343475d23263",

  // https://ropsten.etherscan.io/address/0xcbc48bfb32914b45180bf0a4e635066df3d36a34#code
  jobFactoryAbiPath: "JobFactory-RopstenABI",
  jobFactoryContractAddress: "0xCBc48BFB32914B45180bF0a4E635066df3d36a34",

  ethAddress: "wss://ropsten.infura.io/ws/v3/dc53ba9a23564600bfbe5f8c2f345d1d",
  // ethAddress: 'wss://geth.vm42.us',

  // Turn on chrome dev tools from electron app.
  electronDev: true,

  // Validation Cluster Nodes
  validationNodes: 1,
};

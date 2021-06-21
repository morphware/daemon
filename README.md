# Morphware: Daemon

## Description

`daemon` is the back-end runtime that handles requests from the
`../client` and interacts with the smart contracts in `../service`, in
addition to seeding the models and datasets onto BitTorrent.

It's current implementation is limited to handling the first event,
`JobDescriptionPosted`.  The other events are listed as follows:

1. `JobDescriptionPosted`
2. `AuctionEnded` (from: `AuctionFactory`)
3. `UntrainedModelAndTrainingDatasetShared`
4. `TrainedModelShared`
5. `JobApproved`

## Installation

This section is currently limited to Linux.

### Linux

This section is currently limited to Ubuntu 20.04.

#### Ubuntu 20.04

TODO

## Usage

This development scenario migrates two smart contracts, `JobFactory`
and `AuctionFactory`, to a local blockchain.  For ease of development,
the wallet and contract addresses do not change.

Note: this development scenario does not incorporate a validator-node,
and `AuctionFactory` should be read as `VickreyAuction`.

The following background information should also be taken into account,
for the sake of clarity:

- `accounts[4]` is the wallet address of a data scientist. Within the
scope of this development scenario, `accounts[4]` represents someone 
who wants their machine learning workload to be run by someone else.

- `accounts[1]` is the wallet address of a candidate worker-node, which
should have a dedicated graphics card with a yet-to-be-defined number
of CUDA cores available.  Within the scope of this development
scenario, it loses the auction.

- `accounts[2]` is the wallet address of another candidate worker-node.
Within the scope of this development scenario, it wins the auction.

- `accounts[3]` is the wallet address of a bad actor, which represents
itself as a candidate worker-node. Within the scope of this development
scenario, it loses the auction. It's utility, within the scope of this
development scenario, is to highlight the reason that second-price
auctions are instantiated; instead of first-price auctions.

- `accounts[0]` is the wallet address of the Morphware project. Within
the scope of this development tutorial, it migrates the smart contracts
to the development blockchain and seeds `accounts[1]`; `accounts[2]`;
`accounts[3]`; and `accounts[4]` with Morphware (development) Tokens.

### Command Line (e.g., bash)

The following commands should be entered into a terminal emulator.

This section is also currently limited to Ubuntu 20.04.

#### Ubuntu 20.04

Start the local blockchain:
`npx ganache-cli --deterministic`

In a separate terminal, migrate the `MorphwareToken`, `JobFactory`, and
`AuctionFactory` contracts to the local blockchain:
`./redeploy.sh`

Start the development console:
`npx truffle console --network development`

### Development Console (i.e., Truffle)

The following commands should be entered into the development console.

`morphwareToken = await MorphwareToken.deployed();`

`morphwareToken.transfer(accounts[4],400);`

`vickreyAuction = await VickreyAuction.deployed();`

`morphwareToken.transfer(vickreyAuction.address,100,{from:accounts[4]});`

`morphwareToken.transfer(accounts[1],100);`

`morphwareToken.approve(vickreyAuction.address,12,{from:accounts[1]});`

`var endUserBalance = await morphwareToken.balanceOf(accounts[4]);`
`endUserBalance.toString();  // Should be equal to 300`

// Beginnning of Bidding Phase

jobFactoryContract = await JobFactory.deployed();

morphwareToken.transfer(accounts[2],200);
morphwareToken.transfer(accounts[3],300);

morphwareToken.approve(vickreyAuction.address,23,{from:accounts[2]});
morphwareToken.approve(vickreyAuction.address,34,{from:accounts[3]});

vickreyAuction.bid(accounts[4],0,web3.utils.keccak256(web3.utils.encodePacked(11,false,'0x6d6168616d000000000000000000000000000000000000000000000000000000')),11,{from:accounts[1]});
vickreyAuction.bid(accounts[4],0,web3.utils.keccak256(web3.utils.encodePacked(22,false,'0x6e6168616d000000000000000000000000000000000000000000000000000000')),22,{from:accounts[2]});
vickreyAuction.bid(accounts[4],0,web3.utils.keccak256(web3.utils.encodePacked(33,true,'0x6f6168616d000000000000000000000000000000000000000000000000000000')),33,{from:accounts[3]});

var auctionInstance = await vickreyAuction.auctions(accounts[4],0);
auctionInstance.biddingDeadline.toString();
auctionInstance.revealDeadline.toString();

// End of Bidding Phase
// Beginning of Revealing Phase

vickreyAuction.reveal(accounts[4],0,[11],[false],['0x6d6168616d000000000000000000000000000000000000000000000000000000'],{from:accounts[1]});
vickreyAuction.reveal(accounts[4],0,[22],[false],['0x6e6168616d000000000000000000000000000000000000000000000000000000'],{from:accounts[2]});
vickreyAuction.reveal(accounts[4],0,[33],[true],['0x6f6168616d000000000000000000000000000000000000000000000000000000'],{from:accounts[3]});

var lowestBidderBalance = await morphwareToken.balanceOf(accounts[1]);
lowestBidderBalance.toString();  // Should be equal to 89

vickreyAuction.withdraw({from:accounts[1]});

var lowestBidderBalance = await morphwareToken.balanceOf(accounts[1]);
lowestBidderBalance.toString();  // Should be equal to 100

var highestBidderBalance = await morphwareToken.balanceOf(accounts[2]);
highestBidderBalance.toString(); // Should be equal to 178

var fakeBidderBalance = await morphwareToken.balanceOf(accounts[3]);
fakeBidderBalance.toString();    // Should be equal to 300


// End of Revealing Phase

vickreyAuction.auctionEnd(accounts[4],0);

var endUserBalance = await morphwareToken.balanceOf(accounts[4]);
endUserBalance.toString();    // Should be equal to 300 (i.e., original-balance minus worker-reward)

var auctionContractBalance = await morphwareToken.balanceOf(vickreyAuction.address);
auctionContractBalance.toString();     // Should be equal to 122 (i.e., worker-reward plus the highest-bid)

vickreyAuction.payout(accounts[4],0);

var auctionContractBalance = await morphwareToken.balanceOf(vickreyAuction.address);
auctionContractBalance.toString();     // Should equal to 0 (i.e., worker-reward)

var endUserBalance = await morphwareToken.balanceOf(accounts[4]);
endUserBalance.toString();    // Was equal to 311

var highestBidderBalance = await morphwareToken.balanceOf(accounts[2]);
highestBidderBalance.toString(); // Was equal to 289

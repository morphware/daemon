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

`daemon` relies on a Web3 provider to communicate with the Ethereum
network.  This may either be an Infura endpoint or a local `geth` node,
as the project moves towards production, but has relied on `truffle`
and `ganache`, so far; for ease of development.

The following commands depend on the commands in the Usage sections of
`../client/README.md` and `../service/README.md` to be run first.

Note: this development scenario does not incorporate a validator-node.

### End-user (e.g., data scientist)

```node main.js```

### Worker-node

```node worker.js```

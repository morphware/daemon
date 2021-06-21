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


/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
// import PropTypes from "prop-types";
// // import classNames from "classnames";
// // import ms from "milliseconds";
// // import { connect } from "redux-bundler-react";
// // import { withTranslation } from "react-i18next";
import { Table, Column, AutoSizer, SortDirection } from "react-virtualized";
import "react-virtualized/styles.css";
// // import CountryFlag from 'react-country-flag'
// // import { CopyToClipboard } from "react-copy-to-clipboard";
// // import Cid from "../../components/cid/Cid";
// import { sortByProperty } from "../../lib/sort";

// import "./PeersTable.css";

// export class PeersTable extends React.Component {
//   static propTypes = {
//     peerLocationsForSwarm: PropTypes.array,
//     className: PropTypes.string,
//     t: PropTypes.func.isRequired,
//   };

//   constructor(props) {
//     super(props);

//     this.state = {
//       sortBy: "latency",
//       sortDirection: SortDirection.ASC,
//     };

//     this.sort = this.sort.bind(this);
//   }

//   flagRenderer = (flagCode, isPrivate) => {
//     // Check if the OS is Windows to render the flags as SVGs
//     // Windows doesn't render the flags as emojis  ¯\_(ツ)_/¯
//     const isWindows = window.navigator.appVersion.indexOf("Win") !== -1;
//     return (
//       <span className="f4 pr2">
//         {isPrivate ? (
//           "🤝"
//         ) : flagCode ? (
//           <CountryFlag code={flagCode} svg={isWindows} />
//         ) : (
//           "🌐"
//         )}
//       </span>
//     );
//   };

//   locationCellRenderer = ({ rowData }) => {
//     const ref = React.createRef();
//     const location = rowData.isPrivate ? (
//       this.props.t("localNetwork")
//     ) : rowData.location ? (
//       rowData.isNearby ? (
//         <span>
//           {rowData.location}{" "}
//           <span className="charcoal-muted">({this.props.t("nearby")})</span>
//         </span>
//       ) : (
//         rowData.location
//       )
//     ) : (
//       <span className="charcoal-muted fw4">
//         {this.props.t("app:terms.unknown")}
//       </span>
//     );
//     const value = rowData.location || this.props.t("app:terms.unknown");
//     return (
//       <CopyToClipboard
//         text={value}
//         onCopy={() => copyFeedback(ref, this.props.t)}
//       >
//         <span title={value} className="copyable" ref={ref}>
//           {this.flagRenderer(rowData.flagCode, rowData.isPrivate)}
//           {location}
//         </span>
//       </CopyToClipboard>
//     );
//   };

//   latencyCellRenderer = ({ cellData, rowData }) => {
//     const style = { width: "60px" };
//     const latency = `${cellData}ms`;
//     if (cellData == null)
//       return (
//         <span className="dib o-40 no-select" style={style}>
//           -
//         </span>
//       );
//     return <span className="dib no-select">{latency}</span>;
//   };

//   peerIdCellRenderer = ({ cellData: peerId }) => {
//     const ref = React.createRef();
//     const p2pMultiaddr = `/p2p/${peerId}`;
//     return (
//       <CopyToClipboard
//         text={p2pMultiaddr}
//         onCopy={() => copyFeedback(ref, this.props.t)}
//       >
//         <Cid value={peerId} identicon ref={ref} className="copyable" />
//       </CopyToClipboard>
//     );
//   };

//   protocolsCellRenderer = ({ rowData, cellData }) => {
//     const ref = React.createRef();
//     const { protocols } = rowData;
//     const title = protocols.split(", ").join("\n");
//     return (
//       <CopyToClipboard
//         text={protocols}
//         onCopy={() => copyFeedback(ref, this.props.t)}
//       >
//         <span ref={ref} className="copyable" title={title}>
//           {protocols.replaceAll("[unnamed]", "🤔")}
//         </span>
//       </CopyToClipboard>
//     );
//   };

//   connectionCellRenderer = ({ rowData }) => {
//     const ref = React.createRef();
//     const { address, direction, peerId } = rowData;
//     const p2pMultiaddr = `${address}/p2p/${peerId}`;
//     const title =
//       direction != null
//         ? `${address}\n(${renderDirection(direction, this.props.t)})`
//         : address;

//     return (
//       <CopyToClipboard
//         text={p2pMultiaddr}
//         onCopy={() => copyFeedback(ref, this.props.t)}
//       >
//         <abbr ref={ref} className="copyable" title={title}>
//           {rowData.connection}
//         </abbr>
//       </CopyToClipboard>
//     );
//   };

//   rowClassRenderer = ({ index }, peers = []) => {
//     const { selectedPeers } = this.props;
//     const shouldAddHoverEffect = selectedPeers?.peerIds?.includes(
//       peers[index]?.peerId
//     );

//     return classNames(
//       "bb b--near-white peersTableItem",
//       index === -1 && "bg-near-white",
//       shouldAddHoverEffect && "bg-light-gray"
//     );
//   };

//   sort({ sortBy, sortDirection }) {
//     this.setState({ sortBy, sortDirection });
//   }

//   render() {
//     const { className, peerLocationsForSwarm, t } = this.props;
//     const { sortBy, sortDirection } = this.state;

//     const sortedList = (peerLocationsForSwarm || []).sort(
//       sortByProperty(sortBy, sortDirection === SortDirection.ASC ? 1 : -1)
//     );
//     const tableHeight = 400;

//     return (
//       <div
//         className={`bg-white-70 center ${className}`}
//         style={{ height: `${tableHeight}px`, maxWidth: 1764 }}
//       >
//         {peerLocationsForSwarm && (
//           <AutoSizer disableHeight>
//             {({ width }) => (
//               <Table
//                 className="tl fw4 w-100 f6"
//                 headerClassName="teal fw2 ttu tracked ph2 no-select"
//                 rowClassName={(rowInfo) =>
//                   this.rowClassRenderer(rowInfo, peerLocationsForSwarm)
//                 }
//                 width={width}
//                 height={tableHeight}
//                 headerHeight={32}
//                 rowHeight={36}
//                 rowCount={peerLocationsForSwarm.length}
//                 rowGetter={({ index }) => sortedList[index]}
//                 sort={this.sort}
//                 sortBy={sortBy}
//                 sortDirection={sortDirection}
//               >
//                 <Column
//                   label={t("app:terms.location")}
//                   cellRenderer={this.locationCellRenderer}
//                   dataKey="location"
//                   width={450}
//                   className="f6 charcoal truncate pl2"
//                 />
//                 <Column
//                   label={t("app:terms.latency")}
//                   cellRenderer={this.latencyCellRenderer}
//                   dataKey="latency"
//                   width={200}
//                   className="f6 charcoal pl2"
//                 />
//                 <Column
//                   label={t("app:terms.peerId")}
//                   cellRenderer={this.peerIdCellRenderer}
//                   dataKey="peerId"
//                   width={250}
//                   className="charcoal monospace truncate f6 pl2"
//                 />
//                 <Column
//                   label={t("app:terms.connection")}
//                   cellRenderer={this.connectionCellRenderer}
//                   dataKey="connection"
//                   width={250}
//                   className="f6 charcoal truncate pl2"
//                 />
//                 <Column
//                   label={t("protocols")}
//                   cellRenderer={this.protocolsCellRenderer}
//                   dataKey="protocols"
//                   width={520}
//                   className="charcoal monospace truncate f7 pl2"
//                 />
//               </Table>
//             )}
//           </AutoSizer>
//         )}
//       </div>
//     );
//   }
// }

// // API returns integer atm, but that may change in the future
// // Current mapping based on https://github.com/libp2p/go-libp2p-core/blob/21efed75194d73e21e16fe3124fb9c4127a85308/network/network.go#L38-39
// const renderDirection = (direction, i18n) => {
//   if (direction == null) return;
//   switch (direction) {
//     case 1:
//       return i18n("connectionDirectionInbound");
//     case 2:
//       return i18n("connectionDirectionOutbound");
//     default:
//       return direction;
//   }
// };

// // temporarily replaces contents of element with 'copied!'
// const copyFeedback = (ref, t) => {
//   const tag = ref.current;
//   const { parentNode } = tag;
//   const msg = document.createElement("em");
//   msg.innerText = t("copyFeedback");
//   parentNode.replaceChild(msg, tag);
//   setTimeout(() => parentNode.replaceChild(tag, msg), ms.seconds(2));
// };

import React, { useContext } from "react";
import { ActiveJobsProps } from "../service/DaemonService";
import Web3 from "web3";
import { auctionStatusMapper } from "../utils";
import { DaemonContext } from "../providers/ServiceProviders";

const mockData = {
  canTakeWork: true,
  jobs: {
    "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:11": {
      id: "11",
      instanceId: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:11",
      wallet: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
      type: "poster",
      status: "AuctionEnded",
      transactions: [
        {
          blockHash:
            "0x05ea8a61fed026a0867fa85416bb11ee07fc46c3a29b8cbaa0cd0a8c53920193",
          blockNumber: 11126253,
          contractAddress: null,
          cumulativeGasUsed: 56401,
          effectiveGasPrice: "0x3b9aca08",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 35401,
          logsBloom:
            "0x00000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000080020000000000008000000000000000000000000000000008008000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000010000000000000000000000000000000000000000000000008000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xbc40e97e6d665ce77e784349293d716b030711bc",
          transactionHash:
            "0x39d21abc523795551557f386565680398784b7c1c26008d3aa0508fd9cadabe9",
          transactionIndex: 1,
          type: "0x2",
          events: {
            Transfer: {
              address: "0xbc40E97E6d665CE77E784349293D716B030711bC",
              blockHash:
                "0x05ea8a61fed026a0867fa85416bb11ee07fc46c3a29b8cbaa0cd0a8c53920193",
              blockNumber: 11126253,
              logIndex: 0,
              removed: false,
              transactionHash:
                "0x39d21abc523795551557f386565680398784b7c1c26008d3aa0508fd9cadabe9",
              transactionIndex: 1,
              id: "log_34e39313",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                "2": "1000000000000000000",
                from: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                to: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                value: "1000000000000000000",
              },
              event: "Transfer",
              signature:
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              raw: {
                data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                topics: [
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                  "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
                  "0x000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332",
                ],
              },
            },
          },
          event: "transfer",
        },
        {
          blockHash:
            "0x3e5bccc7c910a8247aa49ad4eb6e4ba506c5bd86e502b7fc5e7c014695c85ea7",
          blockNumber: 11126254,
          contractAddress: null,
          cumulativeGasUsed: 660285,
          effectiveGasPrice: "0x3b9aca08",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 208391,
          logsBloom:
            "0x00000000000000000000000000000000040000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000200000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0x5b49ccf5aec0c370beacd2d9416f5fe326163e69",
          transactionHash:
            "0x192820ab4bbcc0b86423385c88d38300b3ef2776fce3f76350e82869481eba32",
          transactionIndex: 4,
          type: "0x2",
          events: {
            JobDescriptionPosted: {
              address: "0x5b49ccf5AEc0c370BEAcd2d9416F5fe326163e69",
              blockHash:
                "0x3e5bccc7c910a8247aa49ad4eb6e4ba506c5bd86e502b7fc5e7c014695c85ea7",
              blockNumber: 11126254,
              logIndex: 4,
              removed: false,
              transactionHash:
                "0x192820ab4bbcc0b86423385c88d38300b3ef2776fce3f76350e82869481eba32",
              transactionIndex: 4,
              id: "log_58cab7ad",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "11",
                "2": "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                "3": "60",
                "4": "32",
                "5": "1000000000000000000",
                "6": "1632849339",
                "7": "1632849489",
                jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                id: "11",
                auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                estimatedTrainingTime: "60",
                trainingDatasetSize: "32",
                workerReward: "1000000000000000000",
                biddingDeadline: "1632849339",
                revealDeadline: "1632849489",
              },
              event: "JobDescriptionPosted",
              signature:
                "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
              raw: {
                data: "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000061534dbb0000000000000000000000000000000000000000000000000000000061534e51",
                topics: [
                  "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
                ],
              },
            },
          },
          event: "postJobDescription",
        },
        {
          blockHash:
            "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
          blockNumber: 11126275,
          contractAddress: null,
          cumulativeGasUsed: 7397287,
          effectiveGasPrice: "0x3b9aca09",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 37686,
          logsBloom:
            "0x00000000000000000000000000000008000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000001000000000000001000000000000001000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xb6e62b07f3ff2855da9052837df9a221c2ae0332",
          transactionHash:
            "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
          transactionIndex: 17,
          type: "0x2",
          events: {
            AuctionEnded: {
              address: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
              blockHash:
                "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
              blockNumber: 11126275,
              logIndex: 33,
              removed: false,
              transactionHash:
                "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
              transactionIndex: 17,
              id: "log_04e468a8",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "11",
                "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
                "3": "0",
                endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                auctionId: "11",
                winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
                secondHighestBid: "0",
              },
              event: "AuctionEnded",
              signature:
                "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
              raw: {
                data: "0x000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a0000000000000000000000000000000000000000000000000000000000000000",
                topics: [
                  "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
                  "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
                ],
              },
            },
          },
          event: "auctionEnd",
        },
        {
          removed: false,
          logIndex: 33,
          transactionIndex: 17,
          transactionHash:
            "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
          blockHash:
            "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
          blockNumber: 11126275,
          address: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
          id: "log_04e468a8",
          returnValues: {
            "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            "1": "11",
            "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            "3": "0",
            endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            auctionId: "11",
            winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            secondHighestBid: "0",
          },
          event: "AuctionEnded",
          signature:
            "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
          raw: {
            data: "0x000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a0000000000000000000000000000000000000000000000000000000000000000",
            topics: [
              "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
              "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
            ],
          },
        },
      ],
      jobData: {
        "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        "1": "11",
        "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        "3": "0",
        "4": "32",
        "5": "1000000000000000000",
        "6": "1632849339",
        "7": "1632849489",
        jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        id: "11",
        auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
        estimatedTrainingTime: "60",
        trainingDatasetSize: "32",
        workerReward: "1000000000000000000",
        biddingDeadline: "1632849339",
        revealDeadline: "1632849489",
        endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        auctionId: "11",
        winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        secondHighestBid: "0",
      },
      postData: {
        jupyterNotebook: "/home/william/dev/morphware/daemon/devRun.js",
        trainingData: "/home/william/dev/morphware/daemon/README.md",
        testingData: "/home/william/dev/morphware/daemon/build.js",
        stopTraining: "active_monitoring",
        stopTrainingAutomatic: "threshold_value",
        trainingTime: "60",
        biddingTime: "60",
        errorRate: "60",
        workerReward: "1000000000000000000",
        testModel: true,
        files: {
          jupyterNotebook: {
            path: "/home/william/dev/morphware/daemon/devRun.js",
            magnetURI:
              "magnet:?xt=urn:btih:785d28796849da828f300000e51169da14c25c08&dn=devRun.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
          trainingData: {
            path: "/home/william/dev/morphware/daemon/README.md",
            magnetURI:
              "magnet:?xt=urn:btih:1e6ccd5e23c82807fc536a980c13a6bdb877fae7&dn=README.md&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
          testingData: {
            path: "/home/william/dev/morphware/daemon/build.js",
            magnetURI:
              "magnet:?xt=urn:btih:67051057928a7baa6f8e0bd3fe43bab39e226b98&dn=build.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
        },
      },
    },
    "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:12": {
      id: "12",
      instanceId: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:12",
      wallet: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
      type: "poster",
      status: "AuctionEnded",
      transactions: [
        {
          blockHash:
            "0x05ea8a61fed026a0867fa85416bb11ee07fc46c3a29b8cbaa0cd0a8c53920193",
          blockNumber: 11126253,
          contractAddress: null,
          cumulativeGasUsed: 56401,
          effectiveGasPrice: "0x3b9aca08",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 35401,
          logsBloom:
            "0x00000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000080020000000000008000000000000000000000000000000008008000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000010000000000000000000000000000000000000000000000008000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xbc40e97e6d665ce77e784349293d716b030711bc",
          transactionHash:
            "0x39d21abc523795551557f386565680398784b7c1c26008d3aa0508fd9cadabe9",
          transactionIndex: 1,
          type: "0x2",
          events: {
            Transfer: {
              address: "0xbc40E97E6d665CE77E784349293D716B030711bC",
              blockHash:
                "0x05ea8a61fed026a0867fa85416bb11ee07fc46c3a29b8cbaa0cd0a8c53920193",
              blockNumber: 11126253,
              logIndex: 0,
              removed: false,
              transactionHash:
                "0x39d21abc523795551557f386565680398784b7c1c26008d3aa0508fd9cadabe9",
              transactionIndex: 1,
              id: "log_34e39313",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                "2": "1000000000000000000",
                from: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                to: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                value: "1000000000000000000",
              },
              event: "Transfer",
              signature:
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              raw: {
                data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                topics: [
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                  "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
                  "0x000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332",
                ],
              },
            },
          },
          event: "transfer",
        },
        {
          blockHash:
            "0x3e5bccc7c910a8247aa49ad4eb6e4ba506c5bd86e502b7fc5e7c014695c85ea7",
          blockNumber: 11126254,
          contractAddress: null,
          cumulativeGasUsed: 660285,
          effectiveGasPrice: "0x3b9aca08",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 208391,
          logsBloom:
            "0x00000000000000000000000000000000040000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000200000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0x5b49ccf5aec0c370beacd2d9416f5fe326163e69",
          transactionHash:
            "0x192820ab4bbcc0b86423385c88d38300b3ef2776fce3f76350e82869481eba32",
          transactionIndex: 4,
          type: "0x2",
          events: {
            JobDescriptionPosted: {
              address: "0x5b49ccf5AEc0c370BEAcd2d9416F5fe326163e69",
              blockHash:
                "0x3e5bccc7c910a8247aa49ad4eb6e4ba506c5bd86e502b7fc5e7c014695c85ea7",
              blockNumber: 11126254,
              logIndex: 4,
              removed: false,
              transactionHash:
                "0x192820ab4bbcc0b86423385c88d38300b3ef2776fce3f76350e82869481eba32",
              transactionIndex: 4,
              id: "log_58cab7ad",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "11",
                "2": "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                "3": "60",
                "4": "32",
                "5": "1000000000000000000",
                "6": "1632849339",
                "7": "1632849489",
                jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                id: "11",
                auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
                estimatedTrainingTime: "60",
                trainingDatasetSize: "32",
                workerReward: "1000000000000000000",
                biddingDeadline: "1632849339",
                revealDeadline: "1632849489",
              },
              event: "JobDescriptionPosted",
              signature:
                "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
              raw: {
                data: "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000061534dbb0000000000000000000000000000000000000000000000000000000061534e51",
                topics: [
                  "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
                ],
              },
            },
          },
          event: "postJobDescription",
        },
        {
          blockHash:
            "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
          blockNumber: 11126275,
          contractAddress: null,
          cumulativeGasUsed: 7397287,
          effectiveGasPrice: "0x3b9aca09",
          from: "0xf85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
          gasUsed: 37686,
          logsBloom:
            "0x00000000000000000000000000000008000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000001000000000000001000000000000001000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xb6e62b07f3ff2855da9052837df9a221c2ae0332",
          transactionHash:
            "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
          transactionIndex: 17,
          type: "0x2",
          events: {
            AuctionEnded: {
              address: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
              blockHash:
                "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
              blockNumber: 11126275,
              logIndex: 33,
              removed: false,
              transactionHash:
                "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
              transactionIndex: 17,
              id: "log_04e468a8",
              returnValues: {
                "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                "1": "11",
                "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
                "3": "0",
                endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
                auctionId: "11",
                winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
                secondHighestBid: "0",
              },
              event: "AuctionEnded",
              signature:
                "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
              raw: {
                data: "0x000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a0000000000000000000000000000000000000000000000000000000000000000",
                topics: [
                  "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
                  "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
                ],
              },
            },
          },
          event: "auctionEnd",
        },
        {
          removed: false,
          logIndex: 33,
          transactionIndex: 17,
          transactionHash:
            "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
          blockHash:
            "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
          blockNumber: 11126275,
          address: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
          id: "log_04e468a8",
          returnValues: {
            "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            "1": "11",
            "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            "3": "0",
            endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            auctionId: "11",
            winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            secondHighestBid: "0",
          },
          event: "AuctionEnded",
          signature:
            "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
          raw: {
            data: "0x000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a0000000000000000000000000000000000000000000000000000000000000000",
            topics: [
              "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
              "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
            ],
          },
        },
      ],
      jobData: {
        "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        "1": "11",
        "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        "3": "0",
        "4": "32",
        "5": "1000000000000000000",
        "6": "1632849339",
        "7": "1632849489",
        jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        id: "11",
        auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
        estimatedTrainingTime: "60",
        trainingDatasetSize: "32",
        workerReward: "1000000000000000000",
        biddingDeadline: "1632849339",
        revealDeadline: "1632849489",
        endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        auctionId: "11",
        winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        secondHighestBid: "0",
      },
      postData: {
        jupyterNotebook: "/home/william/dev/morphware/daemon/devRun.js",
        trainingData: "/home/william/dev/morphware/daemon/README.md",
        testingData: "/home/william/dev/morphware/daemon/build.js",
        stopTraining: "active_monitoring",
        stopTrainingAutomatic: "threshold_value",
        trainingTime: "60",
        biddingTime: "60",
        errorRate: "60",
        workerReward: "1000000000000000000",
        testModel: true,
        files: {
          jupyterNotebook: {
            path: "/home/william/dev/morphware/daemon/devRun.js",
            magnetURI:
              "magnet:?xt=urn:btih:785d28796849da828f300000e51169da14c25c08&dn=devRun.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
          trainingData: {
            path: "/home/william/dev/morphware/daemon/README.md",
            magnetURI:
              "magnet:?xt=urn:btih:1e6ccd5e23c82807fc536a980c13a6bdb877fae7&dn=README.md&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
          testingData: {
            path: "/home/william/dev/morphware/daemon/build.js",
            magnetURI:
              "magnet:?xt=urn:btih:67051057928a7baa6f8e0bd3fe43bab39e226b98&dn=build.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
        },
      },
    },
    "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:13": {
      id: "13",
      instanceId: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:13",
      wallet: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
      type: "worker",
      status: "UntrainedModelAndTrainingDatasetShared",
      transactions: [
        {
          removed: false,
          logIndex: 4,
          transactionIndex: 4,
          transactionHash:
            "0x192820ab4bbcc0b86423385c88d38300b3ef2776fce3f76350e82869481eba32",
          blockHash:
            "0x3e5bccc7c910a8247aa49ad4eb6e4ba506c5bd86e502b7fc5e7c014695c85ea7",
          blockNumber: 11126254,
          address: "0x5b49ccf5AEc0c370BEAcd2d9416F5fe326163e69",
          id: "log_58cab7ad",
          returnValues: {
            0: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            1: "11",
            2: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
            3: "60",
            4: "32",
            5: "1000000000000000000",
            6: "1632849339",
            7: "1632849489",
            jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            id: "11",
            auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
            estimatedTrainingTime: "60",
            trainingDatasetSize: "32",
            workerReward: "1000000000000000000",
            biddingDeadline: "1632849339",
            revealDeadline: "1632849489",
          },
          event: "JobDescriptionPosted",
          signature:
            "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
          raw: {
            data: "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000061534dbb0000000000000000000000000000000000000000000000000000000061534e51",
            topics: [
              "0xc093ba0ce480cdb2892b4668166575a9c21fc26b0f18e1964554848b732c84a4",
            ],
          },
        },
        {
          blockHash:
            "0x1786a18590aebd617e0456d5cde5b16557aa54f73394c7e93e5014cd343d2df6",
          blockNumber: 11126256,
          contractAddress: null,
          cumulativeGasUsed: 1507853,
          effectiveGasPrice: "0x3b9aca09",
          from: "0x5733592919406a356192ba957e7dffb74fb62d1a",
          gasUsed: 171780,
          logsBloom:
            "0x00100000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080020000000000000000200000000000000000000000000008008000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000010000000000004000000000000000000000000000000000008000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xb6e62b07f3ff2855da9052837df9a221c2ae0332",
          transactionHash:
            "0x47544fce4904791aefd94cc6311cca9292693779dc65399f7be7149977849484",
          transactionIndex: 13,
          type: "0x2",
          events: {
            "0": {
              address: "0xbc40E97E6d665CE77E784349293D716B030711bC",
              blockHash:
                "0x1786a18590aebd617e0456d5cde5b16557aa54f73394c7e93e5014cd343d2df6",
              blockNumber: 11126256,
              logIndex: 7,
              removed: false,
              transactionHash:
                "0x47544fce4904791aefd94cc6311cca9292693779dc65399f7be7149977849484",
              transactionIndex: 13,
              id: "log_3f56e508",
              returnValues: {},
              signature: null,
              raw: {
                data: "0x00000000000000000000000000000000000000000000000003782dace9d90000",
                topics: [
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                  "0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a",
                  "0x000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332",
                ],
              },
            },
            "1": {
              address: "0xbc40E97E6d665CE77E784349293D716B030711bC",
              blockHash:
                "0x1786a18590aebd617e0456d5cde5b16557aa54f73394c7e93e5014cd343d2df6",
              blockNumber: 11126256,
              logIndex: 8,
              removed: false,
              transactionHash:
                "0x47544fce4904791aefd94cc6311cca9292693779dc65399f7be7149977849484",
              transactionIndex: 13,
              id: "log_cb2810f8",
              returnValues: {},
              signature: null,
              raw: {
                data: "0x0000000000000000000000000000000000000000000000000a688906bd8b0000",
                topics: [
                  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                  "0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a",
                  "0x000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332",
                ],
              },
            },
          },
          event: "bid",
        },
        {
          blockHash:
            "0xbe92c75ff3dac99307cb4ea63dbd8db44e1b96b953d0a0db07d3a5467fef9b4c",
          blockNumber: 11126264,
          contractAddress: null,
          cumulativeGasUsed: 7825515,
          effectiveGasPrice: "0x3b9aca08",
          from: "0x5733592919406a356192ba957e7dffb74fb62d1a",
          gasUsed: 115907,
          logsBloom:
            "0x00100000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080020000000000000000000000000000000000000000000008008000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000010000000000004000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          status: true,
          to: "0xb6e62b07f3ff2855da9052837df9a221c2ae0332",
          transactionHash:
            "0x0a5f8a11a5ba4a1b51d302df736e9e5bfbb61b1da080400037349fd693595014",
          transactionIndex: 17,
          type: "0x2",
          events: {
            "0": {
              address: "0xbc40E97E6d665CE77E784349293D716B030711bC",
              blockHash:
                "0xbe92c75ff3dac99307cb4ea63dbd8db44e1b96b953d0a0db07d3a5467fef9b4c",
              blockNumber: 11126264,
              logIndex: 36,
              removed: false,
              transactionHash:
                "0x0a5f8a11a5ba4a1b51d302df736e9e5bfbb61b1da080400037349fd693595014",
              transactionIndex: 17,
              id: "log_37850d21",
              returnValues: {},
              signature: null,
              raw: {
                data: "0x0000000000000000000000000000000000000000000000000000000000000000",
                topics: [
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                  "0x000000000000000000000000b6e62b07f3ff2855da9052837df9a221c2ae0332",
                  "0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a",
                ],
              },
            },
          },
          event: "reveal",
        },
        {
          removed: false,
          logIndex: 33,
          transactionIndex: 17,
          transactionHash:
            "0xd4e990f0f1411a0cae80b29c528ae614e30a52d22f63f2ea75603837cbc49a4c",
          blockHash:
            "0xfe6d25bdf3a3288a236127fddf8adf1aaeb394d0b9186ca12651ddc17279620d",
          blockNumber: 11126275,
          address: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
          id: "log_04e468a8",
          returnValues: {
            "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            "1": "11",
            "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            "3": "0",
            endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            auctionId: "11",
            winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            secondHighestBid: "0",
          },
          event: "AuctionEnded",
          signature:
            "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
          raw: {
            data: "0x000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a0000000000000000000000000000000000000000000000000000000000000000",
            topics: [
              "0x4d31a5599cdb48031c1f03259adbd513be468c5735012719a1a9850869b558b1",
              "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
            ],
          },
        },
        {
          removed: false,
          logIndex: 1,
          transactionIndex: 2,
          transactionHash:
            "0xa647bd7895699abae4130a6620252152187a41e484b498f78659e79b84bdc0b4",
          blockHash:
            "0xb8c39ef65eb612e26145b48f3d5fd3f69d5fccbfaaf8cd62cb3c9f83909a112d",
          blockNumber: 11126276,
          address: "0x5b49ccf5AEc0c370BEAcd2d9416F5fe326163e69",
          id: "log_8232962c",
          returnValues: {
            "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            "1": "11",
            "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            "3": "magnet:?xt=urn:btih:785d28796849da828f300000e51169da14c25c08&dn=devRun.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
            "4": "magnet:?xt=urn:btih:1e6ccd5e23c82807fc536a980c13a6bdb877fae7&dn=README.md&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
            "5": "60",
            jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
            id: "11",
            workerNode: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
            untrainedModelMagnetLink:
              "magnet:?xt=urn:btih:785d28796849da828f300000e51169da14c25c08&dn=devRun.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
            trainingDatasetMagnetLink:
              "magnet:?xt=urn:btih:1e6ccd5e23c82807fc536a980c13a6bdb877fae7&dn=README.md&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
            targetErrorRate: "60",
          },
          event: "UntrainedModelAndTrainingDatasetShared",
          signature:
            "0x71383303ae11065bffb00fa0a58a1bb4595c8c794ebd6adfdcbc3ec56ebaaa95",
          raw: {
            data: "0x00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000001746d61676e65743a3f78743d75726e3a627469683a3738356432383739363834396461383238663330303030306535313136396461313463323563303826646e3d64657652756e2e6a732674723d756470253341253246253246747261636b65722e6c656563686572732d70617261646973652e6f7267253341363936392674723d756470253341253246253246747261636b65722e636f707065727375726665722e746b253341363936392674723d756470253341253246253246747261636b65722e6f70656e747261636b722e6f7267253341313333372674723d7564702533412532462532466578706c6f6469652e6f7267253341363936392674723d756470253341253246253246747261636b65722e656d706972652d6a732e7573253341313333372674723d777373253341253246253246747261636b65722e62746f7272656e742e78797a2674723d777373253341253246253246747261636b65722e6f70656e776562746f7272656e742e636f6d00000000000000000000000000000000000000000000000000000000000000000000000000000000000001746d61676e65743a3f78743d75726e3a627469683a3165366363643565323363383238303766633533366139383063313361366264623837376661653726646e3d524541444d452e6d642674723d756470253341253246253246747261636b65722e6c656563686572732d70617261646973652e6f7267253341363936392674723d756470253341253246253246747261636b65722e636f707065727375726665722e746b253341363936392674723d756470253341253246253246747261636b65722e6f70656e747261636b722e6f7267253341313333372674723d7564702533412532462532466578706c6f6469652e6f7267253341363936392674723d756470253341253246253246747261636b65722e656d706972652d6a732e7573253341313333372674723d777373253341253246253246747261636b65722e62746f7272656e742e78797a2674723d777373253341253246253246747261636b65722e6f70656e776562746f7272656e742e636f6d000000000000000000000000",
            topics: [
              "0x71383303ae11065bffb00fa0a58a1bb4595c8c794ebd6adfdcbc3ec56ebaaa95",
              "0x000000000000000000000000f85ceeb0b76b74205caa2e1a72cdc085bc6eb9bb",
              "0x000000000000000000000000000000000000000000000000000000000000000b",
              "0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a",
            ],
          },
        },
      ],
      jobData: {
        "0": "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        "1": "11",
        "2": "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        "3": "0",
        "4": "32",
        "5": "1000000000000000000",
        "6": "1632849339",
        "7": "1632849489",
        jobPoster: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        id: "11",
        auctionAddress: "0xb6e62B07f3FF2855dA9052837dF9A221c2AE0332",
        estimatedTrainingTime: "60",
        trainingDatasetSize: "32",
        workerReward: "1000000000000000000",
        biddingDeadline: "1632849339",
        revealDeadline: "1632849489",
        endUser: "0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB",
        auctionId: "11",
        winner: "0x5733592919406a356192bA957E7DFfb74fb62d1a",
        secondHighestBid: "0",
      },
    },
  },
};

const activeJobs = Object.values(mockData.jobs);

const activeJobsV2 = activeJobs.map((job) => {
  return {
    jobID: job.id,
    biddingDeadline: job.jobData.biddingDeadline,
    trainingDataSize: job.jobData.trainingDatasetSize,
    workerReward: job.jobData.workerReward,
    status: job.status,
    wallet: job.wallet,
  };
});

console.log("activeJobsVe: ", activeJobsV2);
console.log("length: ", activeJobsV2.length);

const PeersTable = () => {
  const daemonService = useContext(DaemonContext);

  const activeJobsResponse = daemonService.activeJobs;
  const activeJobs = activeJobsResponse
    ? Object.values(activeJobsResponse.jobs)
    : [];
  const activeJobsFiltered = activeJobs.map((job) => {
    return {
      jobID: job.id,
      biddingDeadline: job.jobData.biddingDeadline,
      trainingDataSize: job.jobData.trainingDatasetSize,
      workerReward: job.jobData.workerReward,
      status: job.status,
      wallet: job.wallet,
    };
  });

  console.log("FINAL: ", activeJobsFiltered);

  const biddingDeadlineRenderer = ({ cellData, rowData }: any) => {
    const style = { width: "60px" };
    const epochTime = Number.parseInt(cellData);
    const dateObject = new Date(epochTime * 1000);

    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={style}>
          -
        </span>
      );
    return (
      <span className="dib no-select">{dateObject.toLocaleTimeString()}</span>
    );
  };

  const jobIdRenderer = ({ cellData, rowData }: any) => {
    const style = { width: "60px" };
    const latency = `${cellData}ms`;
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={style}>
          -
        </span>
      );
    return <span className="dib no-select">{cellData}</span>;
  };

  const mwtRenderer = ({ cellData, rowData }: any) => {
    const style = { width: "60px" };
    const convertedMWT = Web3.utils.fromWei(cellData, "ether");
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={style}>
          -
        </span>
      );
    return <span className="dib no-select">{convertedMWT}</span>;
  };

  const statusRenderer = ({ cellData, rowData }: any) => {
    const style = { width: "60px" };
    const status = auctionStatusMapper(cellData);
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={style}>
          -
        </span>
      );
    return <span className="dib no-select">{status}</span>;
  };

  return (
    <div>
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            width={1200}
            height={500}
            headerHeight={20}
            rowHeight={30}
            rowCount={activeJobsFiltered.length}
            rowGetter={({ index }) => activeJobsFiltered[index]}
          >
            <Column
              label="Job ID"
              cellRenderer={jobIdRenderer}
              dataKey="jobID"
              width={100}
              // className="f6 charcoal truncate pl2"
            />
            <Column
              label="Bidding Deadline"
              cellRenderer={biddingDeadlineRenderer}
              dataKey="biddingDeadline"
              width={440}
              // className="f6 charcoal truncate pl2"
            />
            <Column
              label="Training Data Size"
              //  cellRenderer={this.locationCellRenderer}
              dataKey="trainingDataSize"
              width={300}
              className="f6 charcoal truncate pl2"
            />
            <Column
              label="Worker Reward (MWT)"
              cellRenderer={mwtRenderer}
              dataKey="workerReward"
              width={400}
              className="f6 charcoal truncate pl2"
            />
            <Column
              label="Status"
              cellRenderer={statusRenderer}
              dataKey="status"
              width={700}
              className="f6 charcoal truncate pl2"
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default PeersTable;

//Collumns
//Job ID | biddingDeadline | training dataset size | worker reward | status

/* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//   Table,
//   Column,
//   AutoSizer,
//   SortDirection,
//   SortDirectionType,
// } from "react-virtualized";
// import "react-virtualized/styles.css";
// import "./PeersTable.css";

// import React, { useContext, useLayoutEffect, useState } from "react";
// import { ActiveJobsProps } from "../service/DaemonService";
// import Web3 from "web3";
// import { auctionStatusMapper } from "../utils";
// import { DaemonContext } from "../providers/ServiceProviders";
// import { makeStyles, Typography } from "@material-ui/core";
// import { theme } from "../providers/MorphwareTheme";

import React, { useContext, useState } from "react";
import { DaemonContext } from "../providers/ServiceProviders";
import {
  Table,
  Column,
  AutoSizer,
  SortDirection,
  SortDirectionType,
} from "react-virtualized";
import "react-virtualized/styles.css";
import { IconButton, makeStyles, Typography } from "@material-ui/core";
import { theme } from "../providers/MorphwareTheme";
import { copyToClipBoard } from "../utils";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const styles = makeStyles({
  tableHeader: {
    color: theme.metaDataContainer?.main,
    fontWeight: 600,
  },
});

const TorrentsTableV2 = () => {
  const daemonService = useContext(DaemonContext);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    SortDirection.ASC
  );
  const classes = styles();

  //   const torrents = daemonService.torrents?.torrents
  //     ? daemonService.torrents?.torrents
  //     : [];

  const torrents = [
    {
      name: "jupyter-notebook.html",
      progress: 13,
      downloadSpeed: 38,
      numPeers: 41,
      timeRemaining: 63,
      magnetURI:
        "magnet:?xt=urn:btih:f35be570c19b5e026930e97a9533ac7207f960a4&dn=jupyter-notebook.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
    },
    {
      name: "training-data.html",
      progress: 41,
      downloadSpeed: 51,
      numPeers: 43,
      timeRemaining: 71,
      magnetURI:
        "magnet:?xt=urn:btih:7948a0c8a8407274fa5bc63219eaa061b495e5db&dn=training-data.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
    },
    {
      name: "testing-data.md",
      progress: 32,
      downloadSpeed: 21,
      numPeers: 31,
      timeRemaining: 1,
      magnetURI:
        "magnet:?xt=urn:btih:c38689c760a42c2f4060935ebfbf6e55d42350f9&dn=testing-data.md&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337",
    },
  ];

  const sortedTorrents = torrents.sort(
    sortByProperty(sortBy, sortDirection === SortDirection.ASC ? 1 : -1)
  );

  function sortByProperty(property: any, dir = 1) {
    // @ts-ignore - `a` and `b` may not be numbers
    return ({ [property]: a }, { [property]: b }) =>
      // @ts-ignore - `a` and `b` may not be numbers
      (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
  }

  const genericCell = ({ cellData, rowData }: any) => {
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return (
      <span className="dib no-select" style={{ width: "100%" }}>
        {cellData}
      </span>
    );
  };

  const magnetURIRenderer = ({ cellData, rowData }: any) => {
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return (
      <IconButton onClick={() => copyToClipBoard(cellData)}>
        <FileCopyIcon fontSize="medium" color="secondary" />
      </IconButton>
    );
  };

  const sort = ({
    sortBy,
    sortDirection,
  }: {
    sortBy: string;
    sortDirection: SortDirectionType;
  }) => {
    setSortBy(sortBy);
    setSortDirection(sortDirection);
  };

  console.log("sortedTorrents: ", sortedTorrents);

  return (
    <div style={{ maxWidth: 1800, width: "100%" }}>
      <Typography variant="body1">
        <AutoSizer disableHeight style={{ width: "100%" }}>
          {({ width }) => (
            <Table
              rowClassName="TEST_CLASS_NAME"
              width={width}
              height={400}
              headerHeight={20}
              rowHeight={30}
              rowCount={sortedTorrents.length}
              rowGetter={({ index }) => sortedTorrents[index]}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={sort}
              headerClassName={classes.tableHeader}
              rowStyle={{ width: "100%" }}
            >
              <Column
                label="Name"
                cellRenderer={genericCell}
                dataKey="name"
                width={width * 0.2}
                // width={6}
                // className="f6 charcoal truncate pl2"
              />
              <Column
                label="Progress"
                cellRenderer={genericCell}
                dataKey="progress"
                width={width * 0.2}
                // style={{ width: 500 }}
                // width={6}
                // className="f6 charcoal truncate pl2"
              />
              <Column
                label="Download Speed (Mbps)"
                cellRenderer={genericCell}
                dataKey="downloadSpeed"
                width={width * 0.2}
                // width={6}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Peers"
                cellRenderer={genericCell}
                dataKey="numPeers"
                // width={550}
                width={width * 0.2}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Time Remaining (m)"
                cellRenderer={genericCell}
                dataKey="timeRemaining"
                // width={800}
                width={width * 0.2}
                // width={6}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Magnet URI"
                cellRenderer={magnetURIRenderer}
                dataKey="magnetURI"
                // width={800}
                width={width * 0.2}
                // width={6}
                className="f6 charcoal truncate pl2"
              />
            </Table>
          )}
        </AutoSizer>
      </Typography>
    </div>
  );
};

export default TorrentsTableV2;
// const PeersTable = () => {

//   //const activeJobsMock = mockData ? Object.values(mockData.jobs) : [];
//   const manyTorrents = [
//     ...torrents,
//     ...torrents,
//     ...torrents,
//     ...torrents,
//     ...torrents,
//   ];

//   const biddingDeadlineRenderer = ({ cellData, rowData }: any) => {
//     const epochTime = Number.parseInt(cellData);
//     const dateObject = new Date(epochTime * 1000);

//     if (cellData == null)
//       return (
//         <span className="dib o-40 no-select" style={{ width: "100%" }}>
//           -
//         </span>
//       );
//     return (
//       <span className="dib no-select">{dateObject.toLocaleTimeString()}</span>
//     );
//   };

//   const jobIdRenderer = ({ cellData, rowData }: any) => {
//     if (cellData == null)
//       return (
//         <span className="dib o-40 no-select" style={{ width: "100%" }}>
//           -
//         </span>
//       );
//     return (
//       <span className="dib no-select" style={{ width: "100%" }}>
//         {cellData}
//       </span>
//     );
//   };

//   const mwtRenderer = ({ cellData, rowData }: any) => {
//     const convertedMWT = Web3.utils.fromWei(cellData, "ether");
//     if (cellData == null)
//       return (
//         <span className="dib o-40 no-select" style={{ width: "100%" }}>
//           -
//         </span>
//       );
//     return <span className="dib no-select">{convertedMWT}</span>;
//   };

//   const statusRenderer = ({ cellData, rowData }: any) => {
//     const status = auctionStatusMapper(cellData);
//     if (cellData == null)
//       return (
//         <span className="dib o-40 no-select" style={{ width: "100%" }}>
//           -
//         </span>
//       );
//     return <span className="dib no-select">{status}</span>;
//   };

//   const sort = ({
//     sortBy,
//     sortDirection,
//   }: {
//     sortBy: string;
//     sortDirection: SortDirectionType;
//   }) => {
//     setSortBy(sortBy);
//     setSortDirection(sortDirection);
//   };

//   return (
//     <div style={{ maxWidth: 1800, width: "100%" }}>
//       <Typography variant="body1">
//         <AutoSizer disableHeight style={{ width: "100%" }}>
//           {({ width }) => (
//             <Table
//               rowClassName="TEST_CLASS_NAME"
//               width={width}
//               height={400}
//               headerHeight={20}
//               rowHeight={30}
//               rowCount={activeJobsFiltered.length}
//               rowGetter={({ index }) => sortedJobs[index]}
//               sortBy={sortBy}
//               sortDirection={sortDirection}
//               sort={sort}
//               headerClassName={classes.tableHeader}
//               rowStyle={{ width: "100%" }}
//             >
//               <Column
//                 label="Job ID"
//                 cellRenderer={jobIdRenderer}
//                 dataKey="jobID"
//                 width={width * 0.2}
//                 // width={6}
//                 // className="f6 charcoal truncate pl2"
//               />
//               <Column
//                 label="Bidding Deadline"
//                 cellRenderer={biddingDeadlineRenderer}
//                 dataKey="biddingDeadline"
//                 width={width * 0.4}
//                 // style={{ width: 500 }}
//                 // width={6}
//                 // className="f6 charcoal truncate pl2"
//               />
//               <Column
//                 label="Training Data Size"
//                 //  cellRenderer={this.locationCellRenderer}
//                 dataKey="trainingDataSize"
//                 width={width * 0.4}
//                 // width={6}
//                 className="f6 charcoal truncate pl2"
//               />
//               <Column
//                 label="Worker Reward (MWT)"
//                 cellRenderer={mwtRenderer}
//                 dataKey="workerReward"
//                 // width={550}
//                 width={width * 0.45}
//                 className="f6 charcoal truncate pl2"
//               />
//               <Column
//                 label="Status"
//                 cellRenderer={statusRenderer}
//                 dataKey="status"
//                 // width={800}
//                 width={width}
//                 // width={6}
//                 className="f6 charcoal truncate pl2"
//               />
//             </Table>
//           )}
//         </AutoSizer>
//       </Typography>
//     </div>
//   );
// };

// export default PeersTable;

// //Collumns
// //Job ID | biddingDeadline | training dataset size | worker reward | status

// function sortByProperty(property: any, dir = 1) {
//   // @ts-ignore - `a` and `b` may not be numbers
//   return ({ [property]: a }, { [property]: b }) =>
//     // @ts-ignore - `a` and `b` may not be numbers
//     (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
// import PropTypes from "prop-types";
// // import classNames from "classnames";
// // import ms from "milliseconds";
// // import { connect } from "redux-bundler-react";
// // import { withTranslation } from "react-i18next";
import {
  Table,
  Column,
  AutoSizer,
  SortDirection,
  SortDirectionType,
} from "react-virtualized";
import "react-virtualized/styles.css";
import "./PeersTable.css";
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

import React, { useContext, useLayoutEffect, useState } from "react";
import { ActiveJobsProps } from "../service/DaemonService";
import Web3 from "web3";
import { auctionStatusMapper } from "../utils";
import { DaemonContext } from "../providers/ServiceProviders";
import { makeStyles, Typography } from "@material-ui/core";
import { theme } from "../providers/MorphwareTheme";

const styles = makeStyles({
  tableHeader: {
    color: theme.metaDataContainer?.main,
    fontWeight: 600,
  },
});

const AuctionsTable = () => {
  const daemonService = useContext(DaemonContext);
  const [sortBy, setSortBy] = useState("jobID");
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    SortDirection.ASC
  );
  const classes = styles();

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
  const sortedJobs = activeJobsFiltered.sort(
    sortByProperty(sortBy, sortDirection === SortDirection.ASC ? 1 : -1)
  );

  const biddingDeadlineRenderer = ({ cellData, rowData }: any) => {
    const epochTime = Number.parseInt(cellData);
    const dateObject = new Date(epochTime * 1000);

    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return (
      <span className="dib no-select">{dateObject.toLocaleTimeString()}</span>
    );
  };

  const jobIdRenderer = ({ cellData, rowData }: any) => {
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

  const mwtRenderer = ({ cellData, rowData }: any) => {
    const convertedMWT = Web3.utils.fromWei(cellData, "ether");
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return <span className="dib no-select">{convertedMWT}</span>;
  };

  const statusRenderer = ({ cellData, rowData }: any) => {
    const status = auctionStatusMapper(cellData);
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return <span className="dib no-select">{status}</span>;
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
              rowCount={activeJobsFiltered.length}
              rowGetter={({ index }) => sortedJobs[index]}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sort={sort}
              headerClassName={classes.tableHeader}
              rowStyle={{ width: "100%" }}
            >
              <Column
                label="Job ID"
                cellRenderer={jobIdRenderer}
                dataKey="jobID"
                width={width * 0.2}
                // width={6}
                // className="f6 charcoal truncate pl2"
              />
              <Column
                label="Bidding Deadline"
                cellRenderer={biddingDeadlineRenderer}
                dataKey="biddingDeadline"
                width={width * 0.4}
                // style={{ width: 500 }}
                // width={6}
                // className="f6 charcoal truncate pl2"
              />
              <Column
                label="Training Data Size"
                //  cellRenderer={this.locationCellRenderer}
                dataKey="trainingDataSize"
                width={width * 0.4}
                // width={6}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Worker Reward (MWT)"
                cellRenderer={mwtRenderer}
                dataKey="workerReward"
                // width={550}
                width={width * 0.45}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Status"
                cellRenderer={statusRenderer}
                dataKey="status"
                // width={800}
                width={width}
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

export default AuctionsTable;

//Collumns
//Job ID | biddingDeadline | training dataset size | worker reward | status

function sortByProperty(property: any, dir = 1) {
  // @ts-ignore - `a` and `b` may not be numbers
  return ({ [property]: a }, { [property]: b }) =>
    // @ts-ignore - `a` and `b` may not be numbers
    (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
}

import {
  Table,
  Column,
  AutoSizer,
  SortDirection,
  SortDirectionType,
} from "react-virtualized";
import "react-virtualized/styles.css";
import "./AuctionsTable.css";

import React, { useContext, useState } from "react";
import Web3 from "web3";
import { auctionStatusMapper, formatFileSize } from "../utils";
import { DaemonContext } from "../providers/ServiceProviders";
import { makeStyles, Typography, useTheme } from "@material-ui/core";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) => {
  return {
    tableHeader: {
      color: theme.metaDataContainer?.main,
      fontWeight: 600,
    },
  };
});

const AuctionsTable = () => {
  const daemonService = useContext(DaemonContext);
  const [sortBy, setSortBy] = useState("jobID");
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    SortDirection.ASC
  );
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);

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

  const biddingDeadlineRenderer = ({ cellData }: any) => {
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

  const jobIdRenderer = ({ cellData }: any) => {
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

  const mwtRenderer = ({ cellData }: any) => {
    const convertedMWT = Web3.utils.fromWei(cellData.toString(), "ether");
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return <span className="dib no-select">{convertedMWT}</span>;
  };

  const statusRenderer = ({ cellData }: any) => {
    const status = auctionStatusMapper(cellData);
    if (cellData == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return <span className="dib no-select">{status}</span>;
  };

  const trainingDatasetSizeRenderer = ({ cellData }: any) => {
    const sizeInBytes = parseInt(cellData);
    if (sizeInBytes == null)
      return (
        <span className="dib o-40 no-select" style={{ width: "100%" }}>
          -
        </span>
      );
    return <span className="dib no-select">{formatFileSize(sizeInBytes)}</span>;
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
              rowClassName="react_virtualised_row_custom"
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
              />
              <Column
                label="Bidding Deadline"
                cellRenderer={biddingDeadlineRenderer}
                dataKey="biddingDeadline"
                width={width * 0.4}
              />
              <Column
                label="Training Data Size"
                cellRenderer={trainingDatasetSizeRenderer}
                dataKey="trainingDataSize"
                width={width * 0.4}
              />
              <Column
                label="Worker Reward (MWT)"
                cellRenderer={mwtRenderer}
                dataKey="workerReward"
                width={width * 0.45}
              />
              <Column
                label="Status"
                cellRenderer={statusRenderer}
                dataKey="status"
                width={width}
              />
            </Table>
          )}
        </AutoSizer>
      </Typography>
    </div>
  );
};

export default AuctionsTable;

function sortByProperty(property: any, dir = 1) {
  // @ts-ignore - `a` and `b` may not be numbers
  return ({ [property]: a }, { [property]: b }) =>
    // @ts-ignore - `a` and `b` may not be numbers
    (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  IconButton,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import { copyToClipBoard } from "../utils";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import "./AuctionsTable.css";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) => {
  return {
    tableHeader: {
      color: theme.metaDataContainer?.main,
      fontWeight: 600,
    },
  };
});

const TorrentsTable = () => {
  const daemonService = useContext(DaemonContext);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(
    SortDirection.ASC
  );
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);

  const torrents = daemonService.torrents?.torrents
    ? daemonService.torrents?.torrents
    : [];

  const sortedTorrents = torrents.sort(
    sortByProperty(sortBy, sortDirection === SortDirection.ASC ? 1 : -1)
  );

  function sortByProperty(property: any, dir = 1) {
    // @ts-ignore - `a` and `b` may not be numbers
    return ({ [property]: a }, { [property]: b }) =>
      // @ts-ignore - `a` and `b` may not be numbers
      (a == null) - (b == null) || dir * +(a > b) || dir * -(a < b);
  }

  const genericCell = ({ cellData }: any) => {
    if (cellData == null)
      return (
        <span
          className="dib o-40 no-select"
          style={{ width: "100%", backgroundColor: "white" }}
        >
          -
        </span>
      );
    return (
      <span className="dib no-select" style={{ width: "100%" }}>
        {cellData}
      </span>
    );
  };

  const magnetURIRenderer = ({ cellData }: any) => {
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

  return (
    <div style={{ maxWidth: 1800, width: "100%" }}>
      <Typography variant="body1">
        <AutoSizer disableHeight style={{ width: "100%" }}>
          {({ width }) => (
            <Table
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
              />
              <Column
                label="Progress"
                cellRenderer={genericCell}
                dataKey="progress"
                width={width * 0.2}
              />
              <Column
                label="Download Speed (Mbps)"
                cellRenderer={genericCell}
                dataKey="downloadSpeed"
                width={width * 0.22}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Peers"
                cellRenderer={genericCell}
                dataKey="numPeers"
                width={width * 0.2}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Time Remaining (m)"
                cellRenderer={genericCell}
                dataKey="timeRemaining"
                width={width * 0.2}
                className="f6 charcoal truncate pl2"
              />
              <Column
                label="Magnet URI"
                cellRenderer={magnetURIRenderer}
                dataKey="magnetURI"
                width={width * 0.2}
                className="f6 charcoal truncate pl2"
              />
            </Table>
          )}
        </AutoSizer>
      </Typography>
    </div>
  );
};

export default TorrentsTable;

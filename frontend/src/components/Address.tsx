/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from "@material-ui/core";
import React from "react";
import { walletShortener } from "../utils";
import Identicon from "./Identicon";
interface AddressProps {
  walletAddress: string;
}

const Address = ({ walletAddress }: AddressProps) => {
  return (
    <Typography>
      <span>
        <Identicon address={walletAddress} size={25} />
        {walletShortener(walletAddress, 4, 4)}
      </span>
    </Typography>
  );
};

export default Address;

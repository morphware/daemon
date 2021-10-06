/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import WalletImage from "react-identicons";
// import { colors } from "ipfs-css/theme.json";

// const identiconPalette = [
//   colors.navy,
//   colors.aqua,
//   colors.gray,
//   colors.charcoal,
//   colors.red,
//   colors.yellow,
//   colors.teal,
//   colors.green,
// ];

interface IdenticonProps {
  size: number;
  address: string;
}

const pallete = [
  "#5B676D",
  "#55341",
  "#ffffff",
  "#4B4B4C",
  "#C8C8C8",
  "##5B676D",
];

const Identicon = ({ size = 100, address }: IdenticonProps) => (
  <WalletImage string={address} size={size} palette={pallete} />
);

export default Identicon;

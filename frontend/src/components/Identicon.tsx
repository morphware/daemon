import React from "react";
import WalletImage from "react-identicons";

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

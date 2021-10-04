/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from "@material-ui/core";
import React from "react";
import { walletShortener } from "../utils";
import Identicon from "./Identicon";

// export function cidStartAndEnd(value: string) {
//   const chars = value.split("");
//   if (chars.length <= 9) return value;
//   const start = chars.slice(0, 4).join("");
//   const end = chars.slice(chars.length - 4).join("");
//   return {
//     value,
//     start,
//     end,
//   };
// }

// export function shortCid(value: string) {
//   const { value, start, end } = cidStartAndEnd(value);
//   return `${start}…${end}`;
// }

// const Cid = React.forwardRef(
//   ({ value, title, style, identicon = false, ...props }, ref) => {
//     style = Object.assign(
//       {},
//       {
//         textDecoration: "none",
//         marginLeft: identicon ? "5px" : null,
//       },
//       style
//     );
//     const { start, end } = cidStartAndEnd(value);
//     return (
//       <abbr title={title || value} style={style} ref={ref} {...props}>
//         {identicon && <Identicon cid={value} className="mr2" />}
//         <span>
//           {walletShortener()}
//           {/* <span>{start}</span>
//           <span className="o-20">…</span>
//           <span>{end}</span> */}
//         </span>
//       </abbr>
//     );
//   }
// );

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

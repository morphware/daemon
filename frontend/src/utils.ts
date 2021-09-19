export const walletShortener = (
  walletAddress?: string,
  secondLength: number = 3
): string => {
  if (!walletAddress) return "Invalid Wallet";

  const shortenedAddressStart = walletAddress.slice(0, 7);
  const shortenedAddressEnd = walletAddress.slice(42 - secondLength, 43);
  const shortenedAddress = `${shortenedAddressStart}...${shortenedAddressEnd}`;
  return shortenedAddress;
};

export const roundBalance = (balance?: string, decimalPlaces: number = 4) => {
  if (!balance) return 0;
  return parseFloat(balance).toFixed(decimalPlaces);
};

export const copyToClipBoard = (toCopy?: string) => {
  if (!toCopy) return;
  navigator.clipboard.writeText(toCopy);
};

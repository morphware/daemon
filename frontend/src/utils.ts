export const walletShortener = (
  walletAddress?: string,
  firstLength: number = 7,
  secondLength: number = 3
): string => {
  if (!walletAddress) return "Invalid Wallet";

  const shortenedAddressStart = walletAddress.slice(0, firstLength);
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

export const auctionStatusMapper = (status: string) => {
  switch (status) {
    case "JobDescriptionPosted":
      return "Job Description Posted";
    case "AuctionEnded":
      return "Auction Ended";
    case "UntrainedModelAndTrainingDatasetShared":
      return "Untrained Model and Training Data Shared";
    case "TrainedModelShared":
      return "Trained Model Shared";
    case "JobApproved":
      return "Job Approved";
    case "postJobDescription":
      return "Posted Job Description";
    case "bid":
      return "Bidding";
    case "reveal":
      return "Revealing";
    default:
      return "-";
  }
};

// 1. `JobDescriptionPosted`
// 2. `AuctionEnded` (from: `AuctionFactory`)
// 3. `UntrainedModelAndTrainingDatasetShared`
// 4. `TrainedModelShared`
// 5. `JobApproved`

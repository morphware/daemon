const Promise = require("bluebird");

/**
 * @param {!string | !Array.<!string>} txHash, a transaction hash or an array of transaction hashes.
 * @param {Number} interval, in seconds.
 * @returns {!Promise.<!object> | !Promise.<!Array.<!object>>} the receipt or an array of receipts.
 */
const getTransactionReceiptMined = async (web3, txHash, interval) => {
  const transactionReceiptRetry = () =>
    web3.eth
      .getTransactionReceipt(txHash)
      .then((receipt) =>
        receipt != null
          ? receipt
          : Promise.delay(interval ? interval : 500).then(
              transactionReceiptRetry
            )
      );
  if (Array.isArray(txHash)) {
    return sequentialPromise(
      txHash.map(
        (oneTxHash) => () =>
          web3.eth.getTransactionReceiptMined(oneTxHash, interval)
      )
    );
  } else if (typeof txHash === "string") {
    return transactionReceiptRetry();
  } else {
    throw new Error("Invalid Type: " + txHash);
  }
};

/**
 * @param {!Array.<function.Promise.<Any>>} promiseArray.
 * @returns {!Promise.<Array.<Any>>} The results of the promises passed to the function.
 */
const sequentialPromise = async (promiseArray) => {
  const result = promiseArray.reduce(
    (reduced, promise, index) => {
      reduced.results.push(undefined);
      return {
        chain: reduced.chain
          .then(() => promise())
          .then((result) => (reduced.results[index] = result)),
        results: reduced.results,
      };
    },
    {
      chain: Promise.resolve(),
      results: [],
    }
  );
  return result.chain.then(() => result.results);
};

const wait = (ms = 10000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

module.exports = { getTransactionReceiptMined, wait };

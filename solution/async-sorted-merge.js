"use strict";

const { binaryInsertion } = require("./helper");


const printEarliestLog = (logSources, printer) => {
  try {
    if (!logSources.length) {
      // process completed
      return;
    }
    // console.log('logSources', logSources)
    // shift off the most recent log source
    const currentLogSource = logSources.shift();
    // first if might be unnessary, but added to make sure the first element wasn't already drained
    if (!currentLogSource.drained) {
      printer.print(currentLogSource.last)
      currentLogSource.popAsync().then(() => {
        if (!currentLogSource.drained) {
          binaryInsertion(logSources, currentLogSource)
        }
        printEarliestLog(logSources, printer)
      })
    }
  } catch (error) {
    return error
  }
}

// Print all entries, across all of the *async* sources, in chronological order.
module.exports = (logSources, printer) => {
  // initial sort to get values lined up
  logSources.sort((a,b) => a.last.date - b.last.date)
  return new Promise((resolve, reject) => {
    const error = printEarliestLog(logSources, printer);
    if (!error) {
      resolve(console.log("Async sort complete."));
    } else {
      reject(console.log("The print failed with error ", error));
    }
  });
};

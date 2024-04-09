"use strict";

const { binaryInsertion } = require("./helper");


const printEarliestLog = (logSources, printer, resolveFunc, rejectFunc) => {
  try {
    if (!logSources.length) {
      // process completed
      resolveFunc();
      return;
    }

    // shift off the most recent log source
    const currentLogSource = logSources.shift();
    
    // first if might be unnessary, but added to make sure the first element wasn't already drained
    if (!currentLogSource.drained) {
      printer.print(currentLogSource.last)
      currentLogSource.popAsync().then(() => {
        if (!currentLogSource.drained) {
          binaryInsertion(logSources, currentLogSource)
        }
        printEarliestLog(logSources, printer, resolveFunc, rejectFunc)
      })
    } else {
      resolveFunc();
    }
  } catch (error) {
    console.log("error", error)
    rejectFunc();
  }
}

// Print all entries, across all of the *async* sources, in chronological order.
module.exports = (logSources, printer) => {
  // initial sort to get values lined up
  logSources.sort((a,b) => a.last.date - b.last.date)
  return new Promise((resolve, reject) => {
    printEarliestLog(logSources , printer, () => resolve(console.log("Async sort complete.")),  () => reject(console.log("The print failed with error ")));
  });
};

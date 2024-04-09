"use strict";

const { binaryInsertion } = require("./helper");


// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {
  // initial sort to get values lined up
  logSources.sort((a,b) => a.last.date - b.last.date)
  while(logSources.length) {
    // shift off the most recent log source
    const currentLogSource = logSources.shift();
    // first if might be unnessary, but added to make sure the first element wasn't already drained
    if (!currentLogSource.drained) {
      printer.print(currentLogSource.last)
      currentLogSource.pop();
      if (!currentLogSource.drained) {
        binaryInsertion(logSources, currentLogSource)
      }
    }

  } 

  return console.log("Sync sort complete.");
};

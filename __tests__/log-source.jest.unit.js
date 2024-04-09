const LogSource = require("../lib/log-source");
const Printer = require("../lib/printer");
const syncSortedMerge = require("../solution/sync-sorted-merge");
const asyncSortedMerge = require("../solution/async-sorted-merge");

describe("Log Source Behaviors", () => {
  test("It should synchronously drain a log source", () => {
    const source = new LogSource();
    let entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = source.pop();
    expect(entry).toBeFalsy();
  });

  test("It should asynchronously drain a log source", async () => {
    const source = new LogSource();
    let entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = await source.popAsync();
    expect(entry).toBeFalsy();
  });
});

describe("Test Sychonous Sort Merge", () => {
  test("Should not print a drained source", () => {
    const logSpy = jest.spyOn(console, 'log');
    const source = new LogSource();
    source.drained = true;
    const firstMessage = source.last.msg;
    const firstDate = source.last.date;
    syncSortedMerge([source], new Printer());
    expect(logSpy).not.toHaveBeenCalledWith(firstDate, firstMessage);
    expect(logSpy).toHaveBeenCalledWith('Sync sort complete.');
    logSpy.mockClear();
  });

  test("Should print the full log source", () => {
    const logSpy = jest.spyOn(console, 'log');
    const source = new LogSource();
    const firstMessage = source.last.msg;
    const firstDate = source.last.date;
    syncSortedMerge([source, new LogSource(), new LogSource()], new Printer());
    expect(logSpy).toHaveBeenCalledWith(firstDate, firstMessage);
    expect(logSpy).toHaveBeenCalledWith('Sync sort complete.');
    logSpy.mockClear();
  });
});

describe("Test Asynchronously Sort Merge", () => {
  test("Should not print a drained source", async () => {
    const logSpy = jest.spyOn(console, 'log');
    const source = new LogSource();
    source.drained = true;
    const firstMessage = source.last.msg;
    const firstDate = source.last.date;
    await asyncSortedMerge([source], new Printer());
    expect(logSpy).not.toHaveBeenCalledWith(firstDate, firstMessage);
    expect(logSpy).toHaveBeenCalledWith('Async sort complete.');
    logSpy.mockClear();
  });
});

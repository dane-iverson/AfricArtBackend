module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  snapshotSerializers: [
    "<rootDir>/__tests__/testHelpers/snapshotSerializer.js",
  ],
  extensionsToTreatAsEsm: [],
};

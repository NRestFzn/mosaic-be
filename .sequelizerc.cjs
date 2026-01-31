const path = require("node:path");

module.exports = {
  config: path.resolve(__dirname, "config", "config.cjs"),
  "models-path": path.resolve(__dirname, "src", "models"),
  "migrations-path": path.resolve(__dirname, "migrations")
};

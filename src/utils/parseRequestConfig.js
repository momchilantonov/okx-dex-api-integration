const path = require("path");
const fs = require("fs");

function parseRequestConfig(filePath) {
  // Validate file extension
  if (path.extname(filePath).toLowerCase() !== ".json") {
    throw new Error("Only JSON files are allowed");
  }

  // Read and parse the JSON file
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
}

module.exports = {
  parseRequestConfig,
};

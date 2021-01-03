const express = require("express");
const fs = require("fs");

module.exports = {
  staticAssets(app) {
    app.use(express.static(__dirname + "/static"));
    app.use(express.static(__dirname + "/../../lib"));
  },
  serveFile(filepath) {
    return (req, res) => {
      const content = fs.readFileSync(filepath).toString("utf-8");
      res.header("Content-Type", "text/html");
      res.send(content);
    };
  },
};

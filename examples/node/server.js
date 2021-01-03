const Navigo = require("../../lib/navigo");

const express = require("express");
const app = express();
const port = 3000;

app.get("*", (req, res) => {
  function render(content) {
    res.header("Content-Type", "text/html");
    res.send(content);
  }
  const router = new Navigo("/");
  router
    .on("page/:name", (match) => {
      render(match.data.name + " page");
    })
    .on(() => {
      render("home page");
    })
    .notFound(() => {
      render("not found page");
    });

  router.resolve(req.originalUrl);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

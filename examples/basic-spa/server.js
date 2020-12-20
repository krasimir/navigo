const express = require("express");
const app = express();
const port = 3000;
const { staticAssets, serveFile } = require("../utils/server");

staticAssets(app);
app.get("*", serveFile(__dirname + "/page.html"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

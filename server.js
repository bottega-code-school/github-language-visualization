const express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const keys = require("./config/keys");

app.use(express.static(__dirname + "/dist/"));
app.get(/.*/, function(req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port);

console.log("server started");
console.log("process.env ID", process.env.GITHUB_CLIENT_ID);
console.log("process.env Secret", process.env.GITHUB_CLIENT_SECRET);

console.log("keys", keys);

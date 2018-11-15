"use strict";
const express = require("express");
const app = express();
const db = require("./api/model/db.js");
const bodyParser = require("body-parser");
const apiRoutes = require("./api/routes/routes.js");

app.use(bodyParser.json({ limit: "1000kb" }));
app.use(express.static("public"));

app.get("/", (req, res) => res.status(200).send("aemission Server"));

app.use("/api", apiRoutes);

app.listen(process.env.PORT || 8888, process.env.IP || "0.0.0.0", function() {
  console.log("aemission Server listening at", process.env.PORT || 8888);
});

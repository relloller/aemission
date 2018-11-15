"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.set("useCreateIndex", true);
mongoose
  .connect("mongodb://localhost/aemission", { useNewUrlParser: true })
  .then(() => console.log("aemission db connection successful"))
  .catch(err => console.error("aemission db connection error", err));

process.on("SIGINT", function() {
  mongoose.connection.close(() => {
    console.log("disconnected aemission db");
    process.exit(0);
  });
});

"use strict";
const express = require("express");
const router = express.Router();
const UsersCtrl = require("../users/users.controller.js");

router.get("/", (req, res) => res.status(200).send("aemission /api"));
router.post("/register", UsersCtrl.register);

module.exports = router;

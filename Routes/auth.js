const express = require("express");
const router = express.Router();

//import Controllers
const { register, login } = require("../Controllers/auth");

router.post("/register", register);
router.post("/login", login);

module.exports = router;

const LoginUser = require("../Controller/login");
const router = require("express").Router();

router.post("/", LoginUser);

module.exports = router;

const getQCReport = require("../Controller/QCReport")
const router = require("express").Router()

router.post("/", getQCReport);

module.exports = router;
const express = require("express");
const mongoose = require("./Config/config");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const { authenticateAdmin, authenticateUser } = require("./Middleware/auth");
const QCReport_router = require("./Routes/QCReport");
const activateUserRouter =
  require("./Routes/getUserDetails").activateUserRouter;
const pendingUserRouter = require("./Routes/getUserDetails").pendingUserRouter;
const create_user_router = require("./Routes/createUser");
const login_user_router = require("./Routes/login");
const logout_user_router = require("./Routes/logout");
const activate_user_router = require("./Routes/activateUser");
const deactivate_user_router = require("./Routes/deactivateUser");
const agreementAccepted_router = require("./Routes/agreementAccepted");
const checkAccuracy_router = require("./Routes/accuracy");
const pdfUpload_router = require("./Routes/pdfUpload");
const submit_router = require("./Routes/submit");
const changedPassword_router = require("./Routes/changedPassword");
const getPdfInPagination_router = require("./Routes/getPdfInPagination");
const sendMailSeparately_router = require("./Routes/sendMailSeparately");
const approval = require("./Routes/approval");
const delete_user_router = require("./Routes/deleteUser");

app.use("/login", login_user_router);
app.use("/agreement-accepted", agreementAccepted_router);
app.use("/get-approval", approval);

app.use("/activeUser", authenticateAdmin, activateUserRouter);
app.use("/pendingUser", authenticateAdmin, pendingUserRouter);
app.use("/register", authenticateAdmin, create_user_router);
app.use("/deactivate-user", authenticateAdmin, deactivate_user_router);
app.use("/activate-user", authenticateAdmin, activate_user_router);
app.use("/accuracy-check", authenticateAdmin, checkAccuracy_router);
app.use("/pdfUpload", authenticateAdmin, pdfUpload_router);
app.use("/qc-report", authenticateAdmin, QCReport_router);
app.use("/admin", authenticateAdmin, logout_user_router);
app.use("/sendMailSeparately", authenticateAdmin, sendMailSeparately_router);
app.use("/delete", authenticateAdmin, delete_user_router);

app.use("/submit", authenticateUser, submit_router);
app.use("/changed-password", authenticateUser, changedPassword_router);
app.use("/get-pdf", authenticateUser, getPdfInPagination_router);
app.use("/user", authenticateUser, logout_user_router);


// render free service solution
// app.use("/hit", (req, res) => {
//   var hit = 1;
//   console.log("number of hit", hit);
//   hit++;
//   res.status(200).send({ message: hit });
// });

// setInterval(async function () {
//     try {
//         let url = "https://copy-right-backend.onrender.com/hit"
//         // let url = "http://localhost:3000/hit"
//         let response = await fetch(url);
//         let data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error(error);
//     }
// },  270000);


// end here

app.listen(port, () => console.log(`Server is running on ${port}........ `));

const Users = require("../Models/userSchema");
const SendMail = require("./sendMail");
const moment = require("moment");
// const bcrypt = require("bcrypt");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { encryptPassword } = require("./passwordEncryptDecrypt");

createUser = async (req, res) => {
  try {
    let email = req.body.email;
    let { password, ...userData } = req.body;
    const existingUser = await Users.findOne({ email: email });

    if (existingUser)
      return res.status(409).send({ message: "User already exists" });

    const addressObj = {
      state: req.body.state,
      city: req.body.city,
      area: req.body.area,
      pin: req.body.pin,
    };
    userData.address = addressObj;

    // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // password = hashedPassword;
    // userData.password = hashedPassword;
    const encryptPass = await encryptPassword(password);
    userData.password = encryptPass;

    let user = new Users(userData);

    user.startDate = moment(user.createdAt).format("D MMMM YYYY");
    user.endDate = moment(user.createdAt).add(6, "days").format("D MMMM YYYY");
      //await SendMail(req.body, user._id);
      //fs.unlinkSync(__dirname + "/agreement.pdf");
    await user.save();
    res.status(201).send({ message: "Created User successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

function convertAddressToString(addressObj) {
  const { city, pin, state, area } = addressObj;
  return `${area}, ${city}, ${state} - ${pin}`;
}

function savePDF(pdf) {
  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + "/agreement.pdf", pdf, (error) => {
      if (error) {
        reject(error);
      } else {
        console.log("PDF file has been saved!");
        resolve();
      }
    });
  });
}
async function generatePDF(ejsFile) {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  const content = ejsFile;
  await page.setContent(content);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();
  await savePDF(pdf);
  return pdf;
}

module.exports = createUser;

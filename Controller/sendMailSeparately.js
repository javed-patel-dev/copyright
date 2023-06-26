const Users = require("../Models/userSchema");
const SendMail = require("./sendMail");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { decryptPassword } = require("./passwordEncryptDecrypt");

sendMailSeparately = async (req, res) => {
  try {
    let email = req.body.email;
    const existingUser = await Users.findOne({ email: email });
    if (!existingUser)
      return res.status(409).send({ message: "User not exists" });

    let { password , ...userData} = existingUser;

    const decryptPass = await decryptPassword(password);
    existingUser.password = decryptPass;
    let ejsData = {};
    ejsData.path = __dirname + "/../views/agreement.ejs";
    ejsData.name = existingUser.name;
    ejsData.address = convertAddressToString(existingUser.address);
    ejsData.aadhar = existingUser.aadharFront;
    ejsData.pan = existingUser.panFront;
    ejsData.sign = existingUser.signOfUser;

    let ejsFile = await ejs.renderFile(ejsData.path, {
      data: ejsData,
    });

    await generatePDF(ejsFile);

    // Call SendMail function asynchronously and handle any errors
    try {
      await SendMail(existingUser, existingUser._id);
      fs.unlinkSync(__dirname + "/agreement.pdf");
      res
        .status(201)
        .send({ message: "Mail send to User" });
    } catch (err) {
      console.log("Error sending email", err);
      //await user.remove();
      res.status(500).send({ message: "Error sending email" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

function convertAddressToString(addressObj) {
  return `${addressObj.area}, ${addressObj.city}, ${addressObj.state} - ${addressObj.pin}`;
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
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const content = ejsFile;
  await page.setContent(content);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();
  await savePDF(pdf);
  return pdf;
}

module.exports = sendMailSeparately;

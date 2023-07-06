const Users = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const bcrypt = require("bcrypt");
const { decryptPassword } = require("./passwordEncryptDecrypt");

LoginUser = async (req, res) => {
  try {
    const email = req.body.email;
    let user = await Users.findOne({ email: email });
    // const isMatch = await bcrypt.compare(req.body.password, user.password);
    const userPassword = await decryptPassword(user.password);
    if (!user || userPassword !== req.body.password)
      return res.status(200).json({ error: "Invalid email or password" });

    if (user.userType === "user" && user.isLoggedIn === true)
      return res.status(200).send({ message: "User is logged in" });

    if (user.agreementAccepted === false)
      return res.status(200).send({
        message: "Agreement",
        data: {
          _id: user._id,
          name: user.name,
          startDate: user.startDate,
          address: user.address,
          aadharFront: user.aadharFront,
          aadharBack: user.aadharBack,
          signOfUser: user.signOfUser,
        },
      });

    if (user.is_Active === false)
      return res.status(200).send({ message: "Pending Approval" });

    const ipAddress =
      req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;

    await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { isLoggedIn: true, ipAddress: ipAddress } },
      { new: true }
    );

    user = await Users.findOne({ _id: user._id });
    const { password, ...userDetails } = user.toObject();
    res.status(200).send({
      message: `${user.name} has been logged in successfully`,
      data: {
        userDetails,
        token: jwt.sign({ token: user._id }, process.env.JWT_SECRET_KEY),
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = LoginUser;

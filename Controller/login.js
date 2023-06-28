const Users = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const bcrypt = require("bcrypt");
const { decryptPassword } = require("./passwordEncryptDecrypt")

LoginUser = async (req, res) => {
  try {
    const email = req.body.email;
    let user = await Users.findOne({ email: email });
    // const isMatch = await bcrypt.compare(req.body.password, user.password);
    const password = await decryptPassword(user.password);
    if (!user || password !== req.body.password) 
      return res.status(200).json({ error: "Invalid email or password" });

    if (user.isLoggedIn === true)
      return res.status(200).send({ message: "User is logged in" });
      
    if (user.agreementAccepted === false)
      return res.status(200).send({ message: "Agreement" , _id:user._id });

    if (user.is_Active === false)
      return res.status(200).send({ message: "Pending Approval" });

    const ipAddress =
      req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;

    await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { isLoggedIn: true, ipAddress: ipAddress } },
      {new:true}
    );

    user = await Users.findOne({ _id: user._id });

    res.status(200).send({
      message: `${user.name} has been logged in successfully`,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        userType: user.userType,
        startDate: user.startDate,
        endDate:user.endDate,
        completedWork:user.completedWork,
        pendingWork:user.pendingWork,
        agreementAccepted: user.agreementAccepted,
        wallet: user.wallet,
        token: jwt.sign({ token: user._id }, process.env.JWT_SECRET_KEY)
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = LoginUser;

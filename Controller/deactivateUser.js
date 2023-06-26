const Users = require("../Models/userSchema");
const QC = require("../Models/QCReportSchema");
const { decryptPassword } = require("./passwordEncryptDecrypt");


deactivateUser = async (req, res) => {
  try {
    let email = req.body.email;
    let user = await Users.findOne({ email: email });
    //console.log(user);
    if (!user) return res.status(404).send({ message: "Users not found" });

    await Users.updateOne({ _id: user._id }, { $set: { is_Active: false } });
    const decryptPass = await decryptPassword(user.password);
    let report = await QC.findOne({email:email})
    if(report){
      await QC.updateOne({email:email},{$set:{completedWork: user.completedWork,pendingWork: user.pendingWork}})
    }else{
      let QCReport = new QC({
        completedWork: user.completedWork,
        pendingWork: user.pendingWork,
        password: decryptPass,
        email: user.email,
        name: user.name,
      });
      
      QCReport.save();
    }
    

    res.status(200).send({
      message: "User Deactivated successfully & QC Report generated",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = deactivateUser;

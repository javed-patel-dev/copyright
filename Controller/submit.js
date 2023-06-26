const Users = require("../Models/userSchema");

Submit = async (req, res) => {
  try {
    const min = 70;
    const max = 97;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const incAmount = randomNumber > 90 ? 40 : 5;

    const page = Number(req.body.page);
    await Users.findByIdAndUpdate(
      req.body.id,
      { $inc: { wallet: incAmount }, $push: { completedWork: page }, $pull : { pendingWork: page} },
      { new: true }
    );
    res.status(200).send({incVal:incAmount});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = Submit;

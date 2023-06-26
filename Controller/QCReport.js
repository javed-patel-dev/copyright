const QC = require("../Models/QCReportSchema");
const { decryptPassword } = require("./passwordEncryptDecrypt");

getQCReport = async (req, res) => {
  try {
    email=req.body.email;
    let qcReport = await QC.findOne({email:email});
    
    if(qcReport){
      //let data=await process(qcReport);
      res.status(200).send(qcReport);  
    }else{
      res.status(200).send({message:"QC Not Generated"})
    }
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// async function process(data) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       //data.forEach(async (report) => {
//         // let password = await decryptPassword(data.password);
//         // report.password = password;
        
//       //});
//       let password = await decryptPassword(data.password);
//       data.password = password;
//       return data
//       resolve();
//     } catch (error) {
//       console.error(error.message);
//       reject(error);
//     }
//  });
//}

module.exports = getQCReport;

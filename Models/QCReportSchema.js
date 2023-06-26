const mongoose = require("mongoose");

const QCReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ""
    },
    email:{
      type: String,
      default: ""
    },
    password:{
        type: String,
        default: ""
    },
    completedWork: {
        type: Array,
        default: []
    },
    pendingWork: {
        type: Array,
        default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("QC", QCReportSchema);

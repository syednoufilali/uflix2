const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    // console.log(file);
    fs.exists("./uploads/", exist => {
      if (exist) {
        next(null, "./uploads/");
      } else {
        fs.mkdir("./uploads/", (err, folder) => {
          next(null, "./uploads/");
        });
      }
    });
  },
  filename: (req, file, next) => {
    let name = file.originalname.split(".");
    let ext = name.pop();
    let filename = `${name.join("")}-${Date.now()}.${ext}`;
    next(null, filename);
  }
});

exports.upload = multer({
  storage
});

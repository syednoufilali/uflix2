const path = require("path");
const fs = require("fs");
const PATH = require("../server").PUBLIC_PATH;

exports.GET_SERVER_FILES = (req, res, next) => {
  const directoryPath = path.join(PATH, "uploads");
  console.log("Directory path" + directoryPath);

  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const filesArray = [];
    files.forEach(function(file) {
      filesArray.push({
        path: "uploads" + "/" + file,
        name: file,
        time: fs.statSync(path.join(directoryPath, file)).mtimeMs
      });
    });
    console.log(filesArray);
    res.json(
      filesArray.sort((a, b) => {
        return b.time - a.time;
      })
    );
  });
};

exports.ADD_FILE = (req, res, next) => {
  const directoryPath = path.join(PATH, "uploads");
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const filesArray = [];
    files.forEach(function(file) {
      filesArray.push({
        path: "uploads" + "/" + file,
        name: file
      });
    });
    console.log(filesArray);
    res.json(filesArray);
  });
};

exports.GET_AUDIO_FILES = (req, res, next) => {
  const directoryPath = path.join(PATH, "uploads");
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const filesArray = [];
    files.forEach(function(file) {
      const filter = ["mp3", "ogg", "MP3", "OGG"];
      const element = file.split(".");
      if (filter.includes(element[element.length - 1])) {
        filesArray.push({
          path: "uploads" + "/" + file,
          name: file,
          time: fs.statSync(path.join(directoryPath, file)).mtimeMs
        });
      }
    });
    console.log(filesArray);
    res.json(
      filesArray.sort((a, b) => {
        return b.time - a.time;
      })
    );
  });
};

exports.GET_VIDEO_FILES = (req, res, next) => {
  const directoryPath = path.join(PATH, "uploads");
  console.log("Directory path" + directoryPath);
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const filesArray = [];
    files.forEach(function(file) {
      const filter = ["mp4", "MP4", "AVI", "avi"];
      const element = file.split(".");
      if (filter.includes(element[element.length - 1])) {
        filesArray.push({
          path: "uploads" + "/" + file,
          name: file,
          time: fs.statSync(path.join(directoryPath, file)).mtimeMs
        });
      }
    });
    console.log(filesArray);
    res.json(
      filesArray.sort((a, b) => {
        return b.time - a.time;
      })
    );
  });
};
exports.GET_IMAGE_FILES = (req, res, next) => {
  console.log(PATH);

  const directoryPath = path.join(PATH, "uploads");
  console.log("Directory path" + directoryPath);
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    let filesArray = [];
    files.forEach(function(file) {
      const filter = ["png", "jpeg", "jpg", "PNG", "JPEG", "JPG"];
      const element = file.split(".");
      if (filter.includes(element[element.length - 1])) {
        filesArray.push({
          path: "uploads" + "/" + file,
          name: file,
          time: fs.statSync(path.join(directoryPath, file)).mtimeMs
        });
      }
    });
    console.log(filesArray);
    res.json(
      filesArray.sort((a, b) => {
        return b.time - a.time;
      })
    );
  });
};

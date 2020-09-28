module.exports = { PUBLIC_PATH: __dirname };
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/keys");
const cors = require("cors");
const app = express();
const path = require("path");
// Routes
app.use(express.json());
app.use(cors());

app.use(require("./routes/routes"));

const PORT = process.env.PORT || 80;

app.use("/uploads/", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "admin")));
app.use("/admin/", express.static(path.join(__dirname, "admin", "build")));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "admin", "build", "index.html"));
});
app.use("/", express.static(path.join(__dirname, "client", "build")));
app.use(express.static(path.join(__dirname, "client")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
  mongoose
    .connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Connected to database and Server Started on " + PORT);
    })
    .catch(err => {
      console.log(err);
    });
});

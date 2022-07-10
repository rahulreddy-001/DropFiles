const express = require("express");
const cors = require("cors");
const fs = require("fs");
//const Database = require("nedb");
// const db = new Database("../Database/list.db");
// db.loadDatabase();

const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.static("../Public"));
const PORT = 5100 || process.env.port;

app.post("/upload", (req, res) => {
  const file_base_64 = req.body.base64.split(",")[1];
  const file_name = req.body.name;
  const file_uid = req.body.uid;
  if (!fs.existsSync(`../Database/Files/${file_uid}`)) {
    fs.mkdirSync(`../Database/Files/${file_uid}`);
  }
  fs.writeFileSync(
    `../Database/Files/${file_uid}/${file_name}`,
    file_base_64,
    "base64",
    (err) => {
      console.log(err);
    }
  );
  res.send({ ststus: "Success.." });
});

app.post("/id_fetch", (req, res) => {
  const file_uid = req.body.uid;
  if (!fs.existsSync(`../Database/Files/${file_uid}`)) {
    fs.mkdirSync(`../Database/Files/${file_uid}`);
  }
  var items = "";
  const get_link = (ele) => {
    return `<li><a href="/get?uid=${file_uid}&name=${ele}">${ele}</a></li>`;
  };
  fs.readdir(`../Database/Files/${file_uid}`, (err, files) => {
    files.forEach((file) => {
      items += get_link(file);
    });
    res.send({ inHTML: items });
  });
});

app.get("/get", (req, res) => {
  res.sendFile(`./${req.query.uid}/${req.query.name}`, {
    root: "../Database/Files",
  });
});

app.listen(PORT, () => {
  console.log(`Listening..... at ${PORT}...`);
});

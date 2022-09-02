const express = require("express");
const cors = require("cors");
const fs = require("fs");
const mongodb = require("mongodb");
const mongodb_url =
  "#";
const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.static("./Public"));
const PORT = process.env.PORT || 5500;

app.post("/upload", (req, res) => {
  const file_base_64 = req.body.base64.split(",")[1];
  const file_name = req.body.name;
  const file_uid = req.body.uid;
  let file = {
    file_uid: req.body.uid,
    file_name: req.body.name,
    file_base_64: req.body.base64.split(",")[1],
    isProtected: false,
    password: "",
    createdAt: new Date(),
  };
  addFile(file);

  // if (!fs.existsSync(`./Database/Files/${file_uid}`)) {
  //   fs.mkdirSync(`./Database/Files/${file_uid}`);
  // }

  // fs.writeFileSync(
  //   `./Database/Files/${file_uid}/${file_name}`,
  //   file_base_64,
  //   "base64",
  //   (err) => {
  //     console.log(err);
  //   }
  // );

  res.send({
    status: "uploaded",
    link: `/get?uid=${file_uid}&name=${file_name}`,
  });
});

app.post("/id_fetch", async (req, res) => {
  const file_uid = req.body.uid;
  var items = "";
  const get_link = (ele) => {
    return `<li><a href="/get?uid=${file_uid}&name=${ele}">${ele}</a> _ _ _ _ _ <a href="/delete?uid=${file_uid}&name=${ele}">❌</a></li>`;
  };
  let file_list = await getFileList(file_uid);

  file_list.map((e) => {
    items += get_link(e);
  });
  res.send({ inHTML: items });
});

app.get("/get", async (req, res) => {
  let [random_id, file_name] = await getFiles(req.query.uid);
  res.download(`./${random_id}`, file_name, {
    root: "./Database/Files",
  });
});
app.get("/delete", async (req, res) => {
  await deleteFile(req.query.uid, req.query.name);
  res.redirect("/get.html");
});
app.listen(PORT, () => {
  console.log(`Listening..... at ${PORT}...`);
});

let addFile = async (file) => {
  let client = await mongodb.MongoClient.connect(mongodb_url);
  let db = client.db("files");
  let collection = db.collection("files");
  await collection.insertOne(file);
  client.close();
};
let getFileList = async (file_uid) => {
  let client = await mongodb.MongoClient.connect(mongodb_url);
  let db = client.db("files");
  let collection = db.collection("files");
  let files = await collection.find({ file_uid: file_uid }).toArray();
  client.close();
  let file_list = [];
  files.forEach((file) => {
    file_list.push(file.file_name);
  });
  return file_list;
};

let getFiles = async (file_uid) => {
  let client = await mongodb.MongoClient.connect(mongodb_url);
  let db = client.db("files");
  let collection = db.collection("files");
  let files = await collection.find({ file_uid: file_uid }).toArray();
  let file = files[0];
  let file_name = file.file_name;
  let file_base_64 = file.file_base_64;
  let random_id = generateString(25);
  fs.writeFileSync(
    `./Database/Files/${random_id}`,
    file_base_64,
    "base64",
    (err) => {
      console.log(err);
    }
  );

  client.close();
  return [random_id, file_name];
};
let deleteFile = async (file_uid, file_name) => {
  let client = await mongodb.MongoClient.connect(mongodb_url);
  let db = client.db("files");
  let collection = db.collection("files");
  await collection.deleteOne({ file_uid: file_uid, file_name: file_name });
  client.close();
};
function generateString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

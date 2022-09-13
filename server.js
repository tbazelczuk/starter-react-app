require("dotenv").config();

const express = require('express')
const bodyParser = require('body-parser')
const mailer = require("./server/mailer");
const { connect, save, update, getAll, deleteById } = require("./server/repo");

const PORT = process.env.PORT || 3000
const app = express()

connect()

app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/api/sites", async (req, res) => {
  const sites = await getAll();
  res.json(sites);
});

app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, prevItem: { value: 2 } }]);
  res.send("sendMail");
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});

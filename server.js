require("dotenv").config();

const express = require('express')
const bodyParser = require('body-parser')
const mailer = require("./server/mailer");
const { connect, save, update, getAll, deleteById, fetch, fetchAll } = require("./server/repo");

const PORT = process.env.PORT || 3000;
const app = express();

connect()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("build"));

app.get("/api/sites", async (req, res) => {
  const sites = await getAll();
  res.json(sites);
});

app.post("/api/sites", async (req, res) => {
  try {
    const body = req.body;
    const site = await save(body);
    res.json(site);
  } catch ({ message }) {
    res.json({ message });
  }
});

app.put("/api/sites", async (req, res) => {
  const body = req.body
  const site = await update(body)
  res.json(site);
});

app.delete("/api/sites", async (req, res) => {
  const { _id } = req.body
  await deleteById(_id)
  res.json({ _id });
});

app.get("/api/fetch", async (req, res) => {
  const sites = await fetchAll();

  // sites.map(async (site) => {
  //   const { url, selector } = site;
  //   const content = await fetch({ url, selector })
  //   console.log(content)
  // })
  res.json(sites);
});

app.put("/api/fetch", async (req, res) => {
  const { url, selector } = req.body
  const content = await fetch({ url, selector })
  res.json({ content });
});

app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, prevItem: { value: 2 } }]);
  res.send("sendMail");
});

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});

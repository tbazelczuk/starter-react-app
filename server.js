
const express = require('express')
const bodyParser = require('body-parser')
const mailer = require("./server/mailer");

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))


app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, prevItem: { value: 2 } }]);
  res.send("sendMail");
});

app.listen(port, () => {
  console.log(`React app listening at http://localhost:${port}`)
})

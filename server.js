
const express = require('express')
const mailer = require("./server/mailer");

const app = express()

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('build', options))

app.get("/api/sendMail", function (req, res) {
  mailer.sendMail([{ url: "foo", value: 1, prevItem: { value: 2 } }]);
  res.send("sendMail");
});

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`React app listening at http://localhost:${port}`)
})

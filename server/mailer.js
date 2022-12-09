const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "tbazelczuk@gmail.com",
      accessToken,
      clientId,
      clientSecret,
      refreshToken
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  try {
    let emailTransporter = await createTransporter();
    let info = await emailTransporter.sendMail(emailOptions);

    console.log(info)
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error)
  }
};

function prepareHtmlItem(item) {
  if (item.prevItem) {
    return `<strike>${item.prevItem.value}</strike> - ${item.value}`;
  }
  return item.value;
}

function prepareHtml(items) {
  let html = "<ol>";
  for (var i = 0; i < items.length; i++) {
    let item = items[i];
    html += "<li>";
    html +=
      '<a href="' +
      item.url +
      '"> ' +
      item.url +
      "</a> - " +
      prepareHtmlItem(item);
    html += "</li>";
  }
  html += "</ol>";
  return html;
}

function sendMail(items) {
  let html = prepareHtml(items);

  sendEmail({
    subject: "Verifier",
    html: html,
    to: "tbazelczuk@gmail.com",
    from: "tbazelczuk@gmail.com",
  });
}

module.exports = {
  sendMail,
};

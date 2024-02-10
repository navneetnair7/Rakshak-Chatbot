const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: false }));

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check if file type is an image
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

app.post("/webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  console.log(req.body);

  const incomingMessage = req.body.Body.toLowerCase();
  const mediaUrl = req.body.MediaUrl0;
  const type = req.body.MediaContentType0;

  if (incomingMessage === "hello") {
    twiml.message("Hi there! How can I help you?");
  } else if (mediaUrl) {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: accountSid,
          password: authToken,
        },
      });

      //   const fileType =
      //   const fileName = `${Date.now()}`;
      const fileName = `${Date.now()}.${type.split("/")[1]}`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);
      twiml.message(
        "Thanks for the file! I'll take a look and get back to you."
      );
    } catch (error) {
      console.error("Error: ", error);
      twiml.message("Sorry, I couldn't process the image.");
    }
    // console.log("Media URL: ", mediaUrl);
  } else {
    twiml.message("Sorry, I don't understand that command.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

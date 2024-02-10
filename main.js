const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const accountSid = "AC85cc74a4a440bfcd82a87af3739e6aad";
const authToken = "9fdff760d22717e78193a97de08d78bf";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

let name;
let emergencyContacts = [];

app.post("/webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  // console.log(req.body);

  const incomingMessage = req.body.Body.toLowerCase();
  const mediaUrl = req.body.MediaUrl0;
  const type = req.body.MediaContentType0;

  if (incomingMessage === "hello") {
    twiml.message("Hi there! How can I help you?");

    if (emergencyContacts.length == 0) {
      twiml.message("Enter emergency contact numbers");
    }
  } else if (mediaUrl) {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: accountSid,
          password: authToken,
        },
      });

      const fileName = `uploads/${Date.now()}.${type.split("/")[1]}`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);

      // const analysisResult = analyzeAudioFile(filePath);

      if (emergencyContacts.length > 0) {
        const messagePromises = emergencyContacts.map((contact) => {
          return client.calls.create({
            url: "https://demo.twilio.com/welcome/voice/",
            from: "+18447174563",
            to: "+91" + contact,
          });
        });
        console.log("Message Promises: ", messagePromises);
        await Promise.all(messagePromises);
      }

      twiml.message(
        "Thanks for the file! I'll take a look and get back to you."
      );
    } catch (error) {
      console.error("Error: ", error);
      twiml.message("Sorry, I couldn't process the image.");
    }
    // console.log("Media URL: ", mediaUrl);
  } else if (!isNaN(incomingMessage)) {
    emergencyContacts.push(incomingMessage);
    console.log(emergencyContacts);
    twiml.message("Emergency contact added successfully");
  } else {
    twiml.message("Sorry, I don't understand that command.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(emergencyContacts);
  console.log(`Server is running on http://localhost:${port}`);
});

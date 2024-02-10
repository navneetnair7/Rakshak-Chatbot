const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const spawner = require("child_process").spawn;
const app = express();
const port = process.env.PORT || 3000;
const categorized_workflow=require('./routes/categorized_workflow')
const severity=require('./severity')

const accountSid = "AC85cc74a4a440bfcd82a87af3739e6aad";
const authToken = "9fdff760d22717e78193a97de08d78bf";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

let name;
let emergencyContacts = [];

app.post("/webhook", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  console.log(req.body);

  const incomingMessage = req.body.Body.toLowerCase();
  const mediaUrl = req.body.MediaUrl0;
  const type = req.body.MediaContentType0;

  //encoding according to user input messages
  // hello: Hi there? How can I help you?
  //
  if (incomingMessage === "hello") {
    twiml.message("Hi there! How can I help you?");

    if (emergencyContacts.length == 0) {
      twiml.message("Enter emergency contact numbers");
    }
  } else if (mediaUrl && type.split('/')[0] === "image") {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: accountSid,
          password: authToken,
        },
      });
      console.log("Response: ", response.data);

      const fileName = `images/${Date.now()}.${type.split("/")[1]}`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);
      // const cat = await Emergency(filePath);
      // console.log("Category: ", cat);

      // const analysisResult = analyzeAudioFile(filePath);

      // if (emergencyContacts.length > 0) {
      //   const messagePromises = emergencyContacts.map((contact) => {
      //     return client.calls.create({
      //       url: "https://demo.twilio.com/welcome/voice/",
      //       from: "+18447174563",
      //       to: "+91" + contact,
      //     });
      //   });
      //   console.log("Message Promises: ", messagePromises);
      //   await Promise.all(messagePromises);
      // }

      twiml.message(
        "Thanks for the file! I'll take a look and get back to you."
      );
    } catch (error) {
      console.error("Error: ", error);
      twiml.message("Sorry, I couldn't process the image.");
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
      console.log("Response: ", response.data);

      const fileName = `uploads/${Date.now()}.${type.split("/")[1]}`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);
      const cat = await Emergency(filePath);
      const { Latitude, Longitude } = (19.123811721399072,72.83604972314649)
      console.log("Category: ", cat);
      categorized_workflow(cat,Latitude,Longitude)
      
      const severeAccident=await severity(filePath)
      severity(severeAccident)

      const firstAid=await firstAid(filepath)
      //create a response message

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
  } else if (req.body.Latitude && req.body.Longitude) {
    const { Latitude, Longitude } = req.body;
    console.log("Latitude: ", Latitude, "Longitude: ", Longitude);
    // twiml.message("Location received successfully");

    let latitude2 = 19.11736541881868;
    let longitude2 = 72.83513139220759;
    let latitude = parseFloat(Latitude);
    let longitude = parseFloat(Longitude);
    twiml.message(
      `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${latitude2},${longitude2}&travelmode=driving`
    );

    // ("https://www.google.com/maps/dir/?api=1&origin=latitude,longitude&destination=latitude2,longitude2&travelmode=driving");
  } else if (!isNaN(incomingMessage)) {
    emergencyContacts.push(incomingMessage);
    console.log(emergencyContacts);
    twiml.message("Emergency contact added successfully");
  } else {
    // client.messages.create({
    //   body: "Test",
    //   to: "+917021746420",
    //   from: "+18447174563",
    // });

    twiml.message("Sorry, I don't understand that command.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(emergencyContacts);
  console.log(`Server is running on http://localhost:${port}`);
});

async function Emergency(filePath) {
  try {
    const result = await new Promise((res, rej) => {
      console.log("hello");
      const process = spawner("python", ["emergency_Category.py", filePath]);
      let temp = null;

      process.stdout.on("data", (data) => {
        temp = data.toString();
        res(temp);
      });
    });
    return result;
  } catch (err) {
    console.log(new Error(err).message);
  }
}

async function severity(filePath) {
  try {
    const result = await new Promise((res, rej) => {
      console.log("hello");
      const process = spawner("python", ["severity.py", filePath]);
      let temp = null;

      process.stdout.on("data", (data) => {
        temp = data.toString();
        res(temp);
      });
    });
    return result;
  } catch (err) {
    console.log(new Error(err).message);
  }
}


async function firstAid(filePath) {
  try {
    const result = await new Promise((res, rej) => {
      console.log("hello");
      const process = spawner("python", ["first_aid.py", filePath]);
      let temp = null;

      process.stdout.on("data", (data) => {
        temp = data.toString();
        res(temp);
      });
    });
    return result;
  } catch (err) {
    console.log(new Error(err).message);
  }
}


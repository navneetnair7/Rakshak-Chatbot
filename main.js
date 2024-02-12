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
// const categorized_workflow = require("./categorized_workflow");
// const severity = require("./allocate");
const getHospital = require("./allocate");
const workflow = require("./categorized_workflow");

const accountSid = "ACcd3c77d045b9dd55aa78d8244bb2aa25";
const authToken = "5b8813a093646ae9a1b4b361ae03c221";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

// let name;
let emergencyContacts = ["9167543560"];
let latitude2;
let longitude2;

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
    twiml.message("Hi there!");

    if (emergencyContacts.length == 0) {
      twiml.message("Enter emergency contact numbers");
      const messagePromises = emergencyContacts.map((contact) => {
        return client.calls.create({
          url: "https://demo.twilio.com/welcome/voice/",
          from: "+17622499859",
          to: "+91" + contact,
        });
      });
      console.log("Message Promises: ", messagePromises);
      await Promise.all(messagePromises);
    }
  } else if (incomingMessage === "sos") {
    const messagePromises = emergencyContacts.map((contact) => {
      return client.calls.create({
        url: "https://demo.twilio.com/welcome/voice/",
        from: "+17622499859",
        to: "+91" + contact,
      });
    });
    await Promise.all(messagePromises);
  } else if (mediaUrl && type.split("/")[0] === "image") {
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

      const imageCaption = await analyze_image(filePath);
      console.log("Image Caption: ", imageCaption);
      const steps = await firstAid(imageCaption);
      console.log("First Aid Steps: ", steps);

      twiml.message(steps);
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

      let fileName = `uploads/${Date.now()}.${type.split("/")[1]}`;
      let filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);

      // const {cat, text} = await Emergency(filePath);
      let result = await Emergency(filePath);
      result = result.split(" ");
      console.log(result);
      let cat = result[0];
      let text = result[2];
      let { Latitude, Longitude } = (19.123811721399072, 72.83604972314649);
      console.log(text);
      console.log("Category: ", cat);
      workflow(cat, Latitude, Longitude);
      let severeAccident = severity(text);
      const output = getHospital(severeAccident);
      // twiml.message("test")
      console.log(output);

      const first_aid = await firstAid(text);

      // await severeAccident;
      // await first_aid;

      // console.log(output);
      const hospital = output.hospital;
      // const latitude2=output.lat
      // const longitude2=output.lng
      console.log(hospital);
      twiml.message("You have been allocated" + hospital);
      // twiml.message("hello output came");
      //create a response message
      console.log(first_aid);
      // twiml.message(first_aid);
      twiml.message(
        "Evacuate all occupants immediately to safety.\nAlert emergency services and provide accurate location details.\nAdminister first aid for burns: cool affected areas with water, cover with clean cloth, and seek medical attention."
      );
      // console.log("fs msg end");

      twiml.message(
        "Thanks for the file! I'll take a look and get back to you."
      );
    } catch (error) {
      console.error("Error: ", error);
      twiml.message("Sorry, I couldn't process the image.");
    }
  } else if (req.body.Latitude && req.body.Longitude) {
    const { Latitude, Longitude } = req.body;
    console.log("Latitude: ", Latitude, "Longitude: ", Longitude);

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
  } else if (incomingMessage.length > 2) {
    console.log(incomingMessage.length);
    twiml.message("test");
    try {
      const text = EmergencyText(incomingMessage);
      console.log(text);
      let { Latitude, Longitude } = (19.123811721399072, 72.83604972314649);
      workflow(text, Latitude, Longitude);
      // const severeAccident = await severity(incomingMessage);
      const first_aid = await firstAid(incomingMessage);

      // // console.log(severeAccident);
      console.log(first_aid);
      // console.log("hello");

      const output = getHospital(severeAccident);
      console.log(output);
    } catch (error) {
      console.error("Error: ", error);
      // twiml.message("Sorry, I couldn't process the message.");
    }
    // console.log(twiml.toString());
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

async function EmergencyText(text) {
  try {
    const result = await new Promise((res, rej) => {
      // console.log("hello");
      const process = spawner("python", ["emergency_Category.py", text]);
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

async function firstAid(question) {
  try {
    const result = await new Promise((res, rej) => {
      const process = spawner("python", ["first_aid.py", question]);
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

async function analyze_image(filePath) {
  try {
    const result = await new Promise((req, res) => {
      const process = spawner("python", ["image_to_text.py", filePath]);
      let temp = null;

      process.stdout.on("data", (data) => {
        temp = data.toString();
        req(temp);
      });
    });
    return result;
  } catch (err) {
    console.log(new Error(err).message);
  }
}

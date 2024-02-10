const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const twilio = require("twilio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const spawner = require('child_process').spawn
const app = express();
const port = process.env.PORT || 3000;

const accountSid = "AC85cc74a4a440bfcd82a87af3739e6aad";
const authToken = "9fdff760d22717e78193a97de08d78bf";
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

      const fileName = `uploads/${Date.now()}.${type.split("/")[1]}`;
      const filePath = path.join(__dirname, fileName);
      fs.writeFileSync(filePath, response.data);
      const category= await Emergency(filePath)
      
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

async function Emergency (filepath) {
  try {
      const result = await new Promise((res,rej) => {
        const path = require('path');
        const scriptPath = path.join(__dirname, 'emergency_Category.py');
        const process = spawner('python',[scriptPath,filepath])
          let temp = null
          process.stdout.on('data',(data) => {
              temp = data.toString()
              res(temp)
          })  
      })
      return result        
  } catch (err) {
      console.log(new Error(err).message)
  }    
}
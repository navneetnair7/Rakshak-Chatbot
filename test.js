const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials
const accountSid = "ACcd3c77d045b9dd55aa78d8244bb2aa25";
const authToken = "5b8813a093646ae9a1b4b361ae03c221";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webhook', (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();

  const incomingMessage = req.body.Body.toLowerCase();

  if (incomingMessage === 'hello') {
    twiml.message('Hi there! How can I help you?');
  } else if (incomingMessage === 'bye') {
    twiml.message('Goodbye! Have a great day!');
  } else {
    twiml.message("Sorry, I don't understand that command.");
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

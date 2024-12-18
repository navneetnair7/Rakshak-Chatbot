const express = require("express");
const spawner = require("child_process").spawn;
const { default: axios } = require("axios");
const twilio = require("twilio");

const GOOGLE_MAPS_API_KEY = "AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg";
const accountSid = "ACcd3c77d045b9dd55aa78d8244bb2aa25";
const authToken = "5b8813a093646ae9a1b4b361ae03c221";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

async function workflow(category, latitude, longitude) {
  const radius = 1500;
  //workflow for different emergencies
  var places = [];
  if (category == "Medical") {
    places.push("hospital");
  } else if (category == "Criminal") {
    places.push("police");
  } else if (category == "Fire") {
    places.push("fire_station");
    places.push("hospital");
  } else if (category == "Accident") {
    places.push("hospital");
    places.push("police");
  }
  let locations;
  for (let i = 0; i < places.length; i++) {
    locations = await axios
      .get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.116281990837166,72.83482785081533&radius=1000&type=hospital&key=AIzaSyAuA0KGeXETsbBZwiqijItMjOtqh-BnRkU`
      )
      .then((data) => data.data.results);
  }
  // console.log(locations);

  //send messages/alerts to emergency organisations
  let emergencyContacts = ["9326227834", "9167543560"];
  client.messages.create({
    body: `User who has added you as an emergency number is in danger`,
    to: "+917498696490", // Text this number
    from: "+17622499859", // From a valid Twilio number
  });

  //call emergency contacts
  const messagePromises = emergencyContacts.map((contact) => {
    return client.calls.create({
      url: "https://demo.twilio.com/welcome/voice/",
      from: "+17622499859",
      to: "+91" + contact,
    });
  });
  console.log("Message Promises: ", messagePromises);
  await Promise.all(messagePromises);
  // console.log(locations);
  //getting the first location coordinates of location array
  // let latitude2=req.body.latitude
  // let longitude2=req.body.longitude
}
module.exports = workflow;

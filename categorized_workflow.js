const express = require('express')
const spawner = require('child_process').spawn
const { default: axios } = require('axios');
const twilio = require('twilio');

const category = "fire"
const router = express.Router();
const GOOGLE_MAPS_API_KEY = "AIzaSyCI7xUVXdKdCUtFQGIT9TbYMQM2GN27gqg"
const accountSid = "AC85cc74a4a440bfcd82a87af3739e6aad";
const authToken = "9fdff760d22717e78193a97de08d78bf";
const twilioNumber = "+1-415-523-8886";

const client = new twilio(accountSid, authToken);

router.get('/', (req, res) => {
    console.log("Emergency Part")
    res.json("hey, lets calculate emergency locations and contact them")
})


router.post('', async (req, res) => {
    console.log('req');
    console.log(req.body, req.params);
    //accessing the current location
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const radius = 1500;
    //workflow for different emergencies
    var places = []
    if (category == "medical") {
        places.push("hospital")
    }
    else if (category == "criminal") {
        places.push("police")
    }
    else if (category == "fire") {
        places.push("fire_station")
        places.push("hospital")
    }
    else if (category == "accident") {
        places.push("hospital")
        places.push("police")
    }
    let locations;
   for(let i=0;i<places.length;i++)
   {
    locations = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${places[i]}&key=${GOOGLE_MAPS_API_KEY}`).then(data => data.data.results)
   }
    res.json(locations)
    
    //send messages/alerts to emergency organisations
    client.messages.create({
        body: `User is in danger, current location: ${latitude},${longitude}`,
        to: '+917021746420', // Text this number
        from: '+18447174563', // From a valid Twilio number
      });
    
    //call emergency contacts 
    const contact='+919326227834'
    const messagePromises = emergencyContacts.map((contact) => {
        return client.calls.create({
          url: "https://demo.twilio.com/welcome/voice/",
          from: "+18447174563",
          to: "+91" + contact,
        });
      });
      console.log("Message Promises: ", messagePromises);
      await Promise.all(messagePromises);
      
    //getting the first location coordinates of location array
    let latitude2=req.body.latitude
    let longitude2=req.body.longitude

})
export {latitude2,longitude2}
module.exports = router
const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const workflow = require("./categorized_workflow");
// app.use(express.json((urlencoded = true)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

const hospitals = [
  {
    name: "Bellevue Multispeciality Hospital",
    ambulances: 4,
    lat: "19.1270381",
    lng: "72.83188530000001",
  },
  {
    name: "Siddhi Vinayak Hospital",
    ambulances: 2,
    lat: "19.12738629999999",
    lng: "72.831214",
  },
  {
    name: "Saroogi Hospital",
    ambulances: 3,
    lat: "19.12137771970849",
    lng: "72.82888791970849",
  },
];

const police = [
  {
    name: "Versova Police Station",
    lat: "19.1246924",
    lng: "72.8301402"
  },
  {
    name: "DN Nagar Police Station",
    lat: "19.122167",
    lng: "72.8299002"
  },
]

app.post("/emergency", (req, res) => {
  const category = req.body.category;
  const latitude = "19.12333977050408";
  const longitude = "72.8360617516504";
  // workflow(category, latitude, longitude);
  // res.send('hello')
  if(category === "Medical"){
    res.send(hospitals)
  }
  else if(category === "Criminal"){
    res.send(police)
  }
});
app.listen(PORT, (req, res) => {
  console.log("running on port ");
});

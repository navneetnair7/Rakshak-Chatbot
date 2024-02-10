const hospitals = [
  {
    name: "Bellevue Multispeciality Hospital",
    ambulances: 4,
  },
  {
    name: "Siddhi Vinayak Hospital",
    ambulances: 2,
  },
  {
    name: "Saroogi Hospital",
    ambulances: 3,
  },
];

function getHospital(severity) {
  if (severity > 0.5) {
    return hospitals[0]["name"];
  } else {
    for (let i = 0; i < hospitals.length; i++) {
      if (hospitals[i]["ambulances"] > 3) {
        return hospitals[i]["name"];
      }
    }
  }
}

module.exports = getHospital;
const hospitals = [
  {
    name: "Bellevue Multispeciality Hospital",
    ambulances: 4,
    lat: "19.1270381",
    lng: "72.83188530000001"
  },
  {
    name: "Siddhi Vinayak Hospital",
    ambulances: 2,
    lat: "19.12738629999999",
    lng: "72.831214"
  },
  {
    name: "Saroogi Hospital",
    ambulances: 3,
    lat: "19.12137771970849",
    lng: "72.82888791970849"
  },
];

function getHospital(severity) {
  if (severity > 0.5) {
    return hospitals[0]["name"];
  } else {
    for (let i = 0; i < hospitals.length; i++) {
      if (hospitals[i]["ambulances"] > 3) {
        hospitals[i]['ambulances'] --;
        return hospitals[i];
      }
    }
  }
}

module.exports = getHospital;
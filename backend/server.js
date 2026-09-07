const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let sensorData = {
  gas: 0,
  temperature: 0,
  humidity: 0,
  status: "SAFE",
  time: new Date()
};

// ESP32 sends sensor data here
app.post("/api/sensor", (req, res) => {

  const { gas, temperature, humidity } = req.body;

  let status = "SAFE";

  if (gas > 350) {
    status = "GAS LEAK";
  } 
  else if (gas > 200) {
    status = "WARNING";
  }

  sensorData = {
    gas,
    temperature,
    humidity,
    status,
    time: new Date()
  };

  console.log("Sensor Data:", sensorData);

  res.json({
    message: "Data received",
    data: sensorData
  });
});

// React gets latest sensor data here
app.get("/api/sensor", (req, res) => {
  res.json(sensorData);
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
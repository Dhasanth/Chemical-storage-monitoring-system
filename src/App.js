import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [sensorData, setSensorData] = useState({
    gas: 0,
    temperature: 0,
    humidity: 0,
    status: "WAITING",
  });

  const [lastUpdated, setLastUpdated] = useState("");

  // Get real-time data from backend
  const getSensorData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/sensor"
      );

      const data = await response.json();

      setSensorData(data);

      setLastUpdated(
        new Date(data.time).toLocaleTimeString()
      );
    } catch (error) {
      console.log("Backend connection error:", error);
    }
  };

  // Get data every 2 seconds
  useEffect(() => {
    getSensorData();

    const interval = setInterval(() => {
      getSensorData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  let statusClass = "safe";

  if (sensorData.status === "WARNING") {
    statusClass = "warning";
  }

  if (sensorData.status === "GAS LEAK") {
    statusClass = "danger";
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header>
        <h1>Smart Chemical Storage Cabinet</h1>
        <p>
          Gas Exfiltration Monitoring & Alarm System
        </p>
      </header>

      {/* CURRENT READINGS */}
      <section>
        <h2>Current Readings</h2>

        <div className="cards">

          <div className="card">
            <div className="icon">💨</div>

            <h3>Gas Level</h3>

            <p>
              {sensorData.gas}
              <span> ppm</span>
            </p>
          </div>

          <div className="card">
            <div className="icon">🌡️</div>

            <h3>Temperature</h3>

            <p>
              {sensorData.temperature}
              <span> °C</span>
            </p>
          </div>

          <div className="card">
            <div className="icon">💧</div>

            <h3>Humidity</h3>

            <p>
              {sensorData.humidity}
              <span> %</span>
            </p>
          </div>

        </div>
      </section>

      {/* STATUS */}
      <div className={`status ${statusClass}`}>

        <h2>
          {sensorData.status === "SAFE" && "🟢"}
          {sensorData.status === "WARNING" && "🟡"}
          {sensorData.status === "GAS LEAK" && "🔴"}
          {" "}
          Cabinet Status: {sensorData.status}
        </h2>

      </div>

      {/* CONNECTION STATUS */}
      <div className="connection">
        🟢 Connected to Backend
        <br />
        Last Updated: {lastUpdated || "Waiting for data..."}
      </div>

      {/* ALERT HISTORY */}
      <section className="history">

        <h2>Alert History</h2>

        <table>

          <thead>
            <tr>
              <th>Time</th>
              <th>Gas Level</th>
              <th>Alert</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>{lastUpdated || "--"}</td>

              <td>
                {sensorData.gas} ppm
              </td>

              <td>
                {sensorData.status}
              </td>

              <td>
                <span className={sensorData.status === "GAS LEAK"
                  ? "active"
                  : "resolved"}>
                  {sensorData.status}
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </section>

      <footer>
        <p>
          Smart Chemical Storage Cabinet Monitoring System
        </p>

        <p>
          Real-Time Safety Monitoring
        </p>
      </footer>

    </div>
  );
}

export default App;
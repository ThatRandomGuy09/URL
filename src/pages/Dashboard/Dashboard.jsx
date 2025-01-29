import { Smartphone, Monitor, Tablet } from "lucide-react";
import styles from "./Dashboard.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const BASE_URL = "https://url-backend-fczi.onrender.com";

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/links/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { totalClicks, dateWiseClicks, deviceTypes } = response.data;

      setTotalClicks(totalClicks);
      setDateWiseClicks(dateWiseClicks);

      const deviceDataArray = Object.entries(deviceTypes).map(
        ([device, clicks]) => ({ device, clicks })
      );
      setDeviceData(deviceDataArray);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    }
  };

  const calculateBarWidth = (clicks, maxClicks) => {
    if (maxClicks === 0) return "0%";
    return `${(clicks / maxClicks) * 100}%`;
  };

  const maxDateWiseClicks = Math.max(
    ...dateWiseClicks.map((item) => item.clicks + 50),
    0
  );
  const maxDeviceClicks = Math.max(
    ...deviceData.map((item) => item.clicks + 50),
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Total Clicks</h2>
        <div className={styles.totalClicks}>{totalClicks}</div>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Date-wise Clicks</h3>
          <div className={styles.clicksList}>
            {dateWiseClicks.map((item) => (
              <div key={item.date} className={styles.clickItem}>
                <div className={styles.clickDate}>{item.date}</div>
                <div className={styles.clickBar}>
                  <div
                    className={styles.clickBarFill}
                    style={{
                      width: calculateBarWidth(item.clicks, maxDateWiseClicks),
                    }}
                  />
                </div>
                <div className={styles.clickCount}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <h3>Click Devices</h3>
          <div className={styles.deviceList}>
            {deviceData.map((item) => (
              <div key={item.device} className={styles.deviceItem}>
                <div className={styles.deviceIcon}>
                  {item.device === "Mobile" && <Smartphone size={20} />}
                  {item.device === "Desktop" && <Monitor size={20} />}
                  {item.device === "Tablet" && <Tablet size={20} />}
                  <span>{item.device}</span>
                </div>
                <div className={styles.deviceBar}>
                  <div
                    className={styles.deviceBarFill}
                    style={{
                      width: calculateBarWidth(item.clicks, maxDeviceClicks),
                    }}
                  />
                </div>
                <div className={styles.deviceCount}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

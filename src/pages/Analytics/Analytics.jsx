import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../../components/Toast/Toast";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const [linkData, setLinkData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [toastVisible, setToastVisible] = useState(false);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/links`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const enrichedData = response.data.map((link) => {
        const clicks = link.clicks.map((click) => {
          const device = getDeviceType(click.userAgent);
          return {
            timestamp: click.timestamp,
            ip: click.ip,
            userAgent: device,
            originalUrl: link.originalUrl,
            shortUrl: `${BASE_URL}/api/links/${link.shortUrl}`,
          };
        });
        return clicks;
      });

      setLinkData(enrichedData.flat());
    } catch (error) {
      console.error("Error fetching link data:", error.message);
    }
  };

  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown";

    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile")) return "Mobile";
    if (ua.includes("tablet")) return "Tablet";
    if (ua.includes("windows") || ua.includes("macintosh")) return "Desktop";
    if (ua.includes("android")) return "Android";
    if (ua.includes("iphone")) return "iOS";
    return "Unknown";
  };

  const handleSort = () => {
    const sortedData = [...linkData].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setLinkData(sortedData);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={handleSort} className={styles.sortable}>
                Timestamp {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
            {linkData.map((click, index) => (
              <tr key={index}>
                <td>{new Date(click.timestamp).toLocaleString()}</td>
                <td>
                  <a
                    href={click.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {click.originalUrl}
                  </a>
                </td>
                <td>
                  <div className={styles.shortLinkContainer}>
                    <a
                      href={click.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.shortLink}
                    >
                      {click.shortUrl}
                    </a>
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(click.shortUrl)}
                    >
                      Copy
                    </button>
                  </div>
                </td>
                <td>{click.ip}</td>
                <td>{click.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast message="Link copied" visible={toastVisible} />
    </div>
  );
};

export default Analytics;

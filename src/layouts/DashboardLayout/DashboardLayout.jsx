import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Link as LinkIcon,
  BarChart2,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import styles from "./DashboardLayout.module.css";
import React, { useState, useEffect } from "react";
import LinkModal from "../../components/LinkModal/LinkModal";
import axios from "axios";
import UserButton from "../../components/UserButton/UserButton";
import SearchBar from "../../components/SearchBar/SearchBar";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Links", path: "/links", icon: LinkIcon },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      const response = await axios.get(`${BASE_URL}/api/user/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.name;
    } catch (error) {
      console.error("Error fetching user name:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const name = await fetchUserName();
        setUsername(name);
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateNewLink = async (formData) => {
    try {
      const payload = {
        originalUrl: formData.destinationUrl,
        remark: formData.remark || "",
        expirationDate: formData.expirationEnabled
          ? formData.expirationDate
          : null,
      };

      console.log("Payload sent to backend:", payload);

      const response = await axios.post(`${BASE_URL}/api/links`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Link created successfully:", response.data);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating link:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <img src="src/assests/logo.png" className={styles.logo} alt="Logo" />

        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${styles.navLink} ${
                  location.pathname === item.path ? styles.active : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.header1}>
            <div className={styles.greeting}>
              <img
                src="src/assests/sun.png"
                className={styles.sun}
                alt="Sun Icon"
              />
              <h2>Good morning, {username || "User"}</h2>
            </div>
            <span className={styles.date}>Tue, Jan 25</span>
          </div>
          <div className={styles.profile}>
            <button
              className={styles.createLinkBtn}
              onClick={() => setModalOpen(true)}
            >
              <Plus /> Create New Link
            </button>
            <SearchBar />
            <UserButton
              username={username ? username.charAt(0).toUpperCase() : "U"}
              handleLogout={handleLogout}
            />
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
      {modalOpen && (
        <LinkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateNewLink}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

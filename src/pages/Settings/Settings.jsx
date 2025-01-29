import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import styles from "./Settings.module.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const BASE_URL = "https://url-backend-fczi.onrender.com";

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile || "",
      });
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      alert("Failed to fetch user details. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/user/update`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Account deleted successfully");
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account:", error.message);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Mobile Number"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <div className={styles.dangerZone}>
        <Button
          variant="danger"
          fullWidth
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </div>

      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to delete the account?</h3>
            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                NO
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                {loading ? "Deleting..." : "YES"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

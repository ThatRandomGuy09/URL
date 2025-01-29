import { useState, useEffect } from "react";
import React from "react";
import Modal from "../Modal/Modal";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./LinkModal.module.css";

const LinkModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remark: "",
    expirationEnabled: true,
    expirationDate: new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        destinationUrl: initialData.destinationUrl || "",
        remark: initialData.remark || "",
        expirationEnabled: initialData.expirationEnabled || false,
        expirationDate:
          initialData.expirationDate || new Date().toISOString().slice(0, 16),
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destinationUrl) {
      newErrors.destinationUrl = "This field is mandatory";
    } else {
      try {
        new URL(formData.destinationUrl);
      } catch {
        newErrors.destinationUrl = "Please enter a valid URL";
      }
    }

    if (!formData.remark) {
      newErrors.remark = "This field is mandatory";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Full Form Data:", formData);
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      remark: "",
      expirationEnabled: false,
      expirationDate: new Date().toISOString().slice(0, 16),
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Link" : "New Link"}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <Input
            label="Destination Url *"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleChange}
            error={errors.destinationUrl}
          />
        </div>

        <div className={styles.field}>
          <Input
            label="Remark *"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            error={errors.remark}
          />
        </div>

        <div className={styles.expirationField}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="expirationEnabled"
              checked={formData.expirationEnabled}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
          <span>Link Expiration</span>
        </div>

        {formData.expirationEnabled && (
          <div className={styles.field}>
            <Input
              type="datetime-local"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit">{initialData ? "Save" : "Create new"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default LinkModal;

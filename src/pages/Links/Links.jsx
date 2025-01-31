import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2, Clipboard } from "lucide-react";
import Toast from "../../components/Toast/Toast";
import styles from "./Links.module.css";
import LinkModal from "../../components/LinkModal/LinkModal";
import Modal from "../../components/Modal/Modal";

const Links = () => {
  const { links, setLinks } = useOutletContext(); // Get latest links from context
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/links`;

  // Handle date sorting
  const handleSort = () => {
    const sortedData = [...links].sort((a, b) => {
      const dateA = new Date(a.expirationDate || "").getTime() || 0;
      const dateB = new Date(b.expirationDate || "").getTime() || 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setLinks(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(`${BASE_URL}/${shortUrl}`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleEdit = (link) => {
    setCurrentLink(link);
    setModalOpen(true);
  };

  const handleUpdateLink = async (formData) => {
    try {
      const payload = {
        originalUrl: formData.destinationUrl,
        remark: formData.remark || "",
        expirationDate: formData.expirationEnabled
          ? formData.expirationDate
          : null,
      };

      const response = await axios.put(
        `${BASE_URL}/short/${currentLink.shortUrl}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.shortUrl === currentLink.shortUrl ? response.data : link
        )
      );

      setModalOpen(false);
      setCurrentLink(null);
    } catch (error) {
      console.error("Error updating link:", error.message);
    }
  };

  const handleDelete = (link) => {
    setCurrentLink(link);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/short/${currentLink.shortUrl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setLinks((prevLinks) =>
        prevLinks.filter((link) => link.shortUrl !== currentLink.shortUrl)
      );
      setDeleteModalOpen(false);
      setCurrentLink(null);
    } catch (error) {
      console.error("Error deleting link:", error.message);
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = links.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(links.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tablehead}>
            <tr>
              <th onClick={handleSort} className={styles.sortable}>
                Date {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.shortUrl}>
                <td>
                  {item.expirationDate
                    ? new Date(item.expirationDate).toLocaleString()
                    : "No Expiry"}
                </td>
                <td>
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {item.originalUrl}
                  </a>
                </td>
                <td>
                  <div className={styles.shortLinkContainer}>
                    <a
                      href={`${BASE_URL}/${item.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.shortLink}
                    >
                      {`${BASE_URL}/${item.shortUrl}`}
                    </a>
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(item.shortUrl)}
                    >
                      <Clipboard size={16} />
                    </button>
                  </div>
                </td>
                <td>{item.remark}</td>
                <td>{item.totalClicks || 0}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
      <Toast message="Link copied" visible={toastVisible} />
      {modalOpen && (
        <LinkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleUpdateLink}
          initialData={{
            destinationUrl: currentLink.originalUrl,
            remark: currentLink.remark,
            expirationEnabled: !!currentLink.expirationDate,
            expirationDate: currentLink.expirationDate || "",
          }}
        />
      )}
      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this link?</p>
          <div className={styles.modalActions}>
            <button type="button" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Links;

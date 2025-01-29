import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Clipboard } from "lucide-react";
import Toast from "../../components/Toast/Toast";
import styles from "./Links.module.css";
import LinkModal from "../../components/LinkModal/LinkModal";

const Links = () => {
  const [linksData, setLinksData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state
  const BASE_URL = "https://url-backend-fczi.onrender.com/api/links";

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLinksData(response.data);
    } catch (error) {
      console.error("Error fetching links data:", error.message);
    }
  };

  // Handle date sorting
  const handleSort = () => {
    const sortedData = [...linksData].sort((a, b) => {
      const dateA = new Date(a.expirationDate).getTime();
      const dateB = new Date(b.expirationDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setLinksData(sortedData);
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

      await axios.put(`${BASE_URL}/short/${currentLink.shortUrl}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchLinks();
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
      fetchLinks();
      setDeleteModalOpen(false);
      setCurrentLink(null);
    } catch (error) {
      console.error("Error deleting link:", error.message);
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = linksData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(linksData.length / itemsPerPage);

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
                <td>{new Date(item.expirationDate).toLocaleString()}</td>
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

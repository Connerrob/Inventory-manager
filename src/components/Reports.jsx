import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHome, FaClipboardList, FaFileImport, FaSignOutAlt } from 'react-icons/fa';
import { db } from '../firebase';
import './Dashboard.css';

const Reports = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsSnapshot = await getDocs(collection(db, 'assetLogs'));
        const logsList = logsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort logs descending by timestamp
        logsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(logsList);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${collapsed ? 'collapsed' : 'open'}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                {collapsed ? <FaHome /> : 'Home'}
              </Link>
            </li>
            <li>
              <Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
                {collapsed ? <FaClipboardList /> : 'Reports'}
              </Link>
            </li>
            <li>
              <Link to="/Import" className={location.pathname === '/Import' ? 'active' : ''}>
                {collapsed ? <FaFileImport /> : <> <FaFileImport /> Import</>}
              </Link>
            </li>
            <li>
              <a href="#">
                {collapsed ? <FaSignOutAlt /> : 'Logout'}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <h2 className="section-title">Activity Logs</h2>
        {logs.length === 0 ? (
          <p>No activity yet.</p>
        ) : (
          <>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Item</th>
                  <th>Changes</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.actionType}</td>
                    <td>{log.assetName}</td>
                    <td>
                      {/* Check if 'changes' is populated or not */}
                      {log.changes && Object.keys(log.changes).length > 0 ? (
                        Object.entries(log.changes).map(([field, change], i) => (
                          <div key={i}>
                            <strong>{field}:</strong> {change.from} → {change.to}
                          </div>
                        ))
                      ) : log.changes === null ? (
                        'No changes'
                      ) : (
                        'No changes recorded'
                      )}
                    </td>
                    <td>{formatTimestamp(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              {totalPages <= 10 ? (
                Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? 'active-page' : ''}
                  >
                    {index + 1}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={currentPage === 1 ? 'active-page' : ''}
                  >
                    1
                  </button>

                  {currentPage > 6 && <span className="ellipsis">...</span>}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page !== 1 &&
                      page !== totalPages &&
                      page >= currentPage - 4 &&
                      page <= currentPage + 4
                    )
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active-page' : ''}
                      >
                        {page}
                      </button>
                    ))}

                  {currentPage < totalPages - 5 && <span className="ellipsis">...</span>}

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={currentPage === totalPages ? 'active-page' : ''}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;

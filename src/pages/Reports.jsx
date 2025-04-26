import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import Sidebar from '../components/Sidebar';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';
import '../styles/Reports.css';

const Reports = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const location = useLocation();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsSnapshot = await getDocs(collection(db, 'assetLogs'));
        const logsList = logsSnapshot.docs.map(doc => {
          const log = doc.data();
          let timestamp = log.timestamp;
  
          // Check if it's a Firestore Timestamp object
          if (timestamp && timestamp.toDate) {
            timestamp = timestamp.toDate(); // Convert to JavaScript Date object
          } else if (typeof timestamp === 'string') {
            timestamp = new Date(timestamp); // If it's a string, convert it to Date
          } else {
            timestamp = 'Invalid Date'; // Handle if timestamp is missing or invalid
          }
  
          return { id: doc.id, ...log, timestamp };
        });
  
        logsList.sort((a, b) => (a.timestamp !== 'Invalid Date' && b.timestamp !== 'Invalid Date' ? b.timestamp - a.timestamp : 0));
  
        setLogs(logsList);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
  
    fetchLogs();
  }, []);
  

  const formatTimestamp = (timestamp) => {
    if (!(timestamp instanceof Date) || isNaN(timestamp)) return 'Invalid Date';
    return timestamp.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  
  
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <Container fluid className="reports-container">
      <Row>
        <Col xs={2}>
          <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} location={location} />
        </Col>
        <Col xs={10}>
          <div className="reports-content">
            <h2 className="section-title">Activity Logs</h2>
            {logs.length === 0 ? (
              <Alert variant="info">No activity logged yet. Check back later!</Alert>
            ) : (
              <>
                <Table striped bordered hover className="styled-table">
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
                          {log.changes && Object.keys(log.changes).length > 0 ? (
                            Object.entries(log.changes).map(([field, change], i) => (
                              <div key={i} className="change-item">
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
                </Table>

                <div className="pagination">
                  {totalPages <= 10 ? (
                    Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'active-page' : ''}
                        aria-label={`Go to page ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))
                  ) : (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={currentPage === 1 ? 'active-page' : ''}
                        aria-label="Go to first page"
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
                            aria-label={`Go to page ${page}`}
                          >
                            {page}
                          </button>
                        ))}

                      {currentPage < totalPages - 5 && <span className="ellipsis">...</span>}

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={currentPage === totalPages ? 'active-page' : ''}
                        aria-label="Go to last page"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;

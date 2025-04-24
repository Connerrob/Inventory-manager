import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHome, FaClipboardList, FaFileImport, FaSignOutAlt } from 'react-icons/fa';
import Papa from 'papaparse';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';
import { logAction } from '../utils';
import './Import.css';

const Import = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const downloadTemplate = () => {
    const csvHeaders = ['Item Name', 'Category', 'Description', 'Quantity'];
    const csvContent = [csvHeaders.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const confirmImport = window.confirm(`Are you sure you want to import "${file.name}"?`);
    if (!confirmImport) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      Papa.parse(e.target.result, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsedData = results.data;
          const validItems = parsedData.filter(item =>
            item['Item Name'] && item['Category'] && item['Description'] && item['Quantity']
          );

          let addedCount = 0;
          let updatedCount = 0;

          for (const item of validItems) {
            const itemName = item['Item Name'].trim();

            const q = query(collection(db, 'assets'), where('name', '==', itemName));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              const docRef = snapshot.docs[0].ref;
              const existingItem = snapshot.docs[0].data();

              const hasChanged =
                existingItem.category !== item['Category'] ||
                existingItem.description !== item['Description'] ||
                Number(existingItem.quantity) !== Number(item['Quantity']);

              if (hasChanged) {
                const updatedItem = {
                  name: itemName,
                  category: item['Category'],
                  description: item['Description'],
                  quantity: Number(item['Quantity']),
                };

                await updateDoc(docRef, updatedItem);
                await logAction('edit', {
                  oldItem: existingItem,
                  newItem: updatedItem
                });

                updatedCount++;
              } else {
                console.log(`No changes for ${itemName}, skipping`);
              }

            } else {
              const newItem = {
                name: itemName,
                category: item['Category'],
                description: item['Description'],
                quantity: Number(item['Quantity']),
              };

              await addDoc(collection(db, 'assets'), newItem);
              await logAction('Imported', newItem);
              addedCount++;
            }
          }

          alert(`${addedCount} item(s) imported and ${updatedCount} item(s) updated!`);
        }
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${collapsed ? 'collapsed' : 'open'}`}>
        <button className="toggle-btn" onClick={toggleSidebar}><FaBars /></button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                {collapsed ? <FaHome /> : <><FaHome /> Home</>}
              </Link>
            </li>
            <li>
              <Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
                {collapsed ? <FaClipboardList /> : <><FaClipboardList /> Reports</>}
              </Link>
            </li>
            <li>
              <Link to="/Import" className={location.pathname === '/Import' ? 'active' : ''}>
                {collapsed ? <FaFileImport /> : <><FaFileImport /> Import</>}
              </Link>
            </li>
            <li>
              <a href="#">{collapsed ? <FaSignOutAlt /> : <><FaSignOutAlt /> Logout</>}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="navbar">
          <h1>Import</h1>
        </div>
        <div className="import-container">
          <h2>Import Inventory Items</h2>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <p>Upload a CSV file with columns: <strong>Item Name, Category, Description, Quantity</strong></p>
          
          <button onClick={downloadTemplate} className="template-btn">
            Download CSV Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default Import;

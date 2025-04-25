import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { logAction } from '../utils';
import Papa from 'papaparse';
import Sidebar from '../components/Sidebar';
import AddAssetModal from '../components/AddAssetModal';

const Import = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

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
                await logAction('edit', { oldItem: existingItem, newItem: updatedItem });
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
    <div className="import-container-wrapper">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} location={location} />
      <div className={`import-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="import-content-wrapper">
          <h2>Import Inventory Items</h2>
          <div className="file-upload-container">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="file-input"
            />
            <p className="file-instruction">
              Upload a CSV file with columns: <strong>Item Name, Category, Description, Quantity</strong>
            </p>
          </div>
          
          <button onClick={downloadTemplate} className="download-template-btn">
            Download CSV Template
          </button>

          <AddAssetModal showModal={showModal} closeModal={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default Import;

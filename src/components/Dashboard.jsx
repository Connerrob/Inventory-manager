import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FaHome, FaClipboardList, FaFileImport, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', description: '', quantity: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'


  const assetsPerPage = 10;
  const location = useLocation();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assets'));
        const assetsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssets(assetsList);
      } catch (e) {
        console.error('Error fetching items: ', e);
      }
    };
    fetchAssets();
  }, []);

  const logAction = async (actionType, asset, changes = null) => {
    try {
      const logEntry = {
        actionType,
        assetName: asset.name,
        timestamp: new Date().toLocaleString(),
        changes,
      };
      await addDoc(collection(db, 'assetLogs'), logEntry);
      console.log('Log added:', logEntry);
    } catch (e) {
      console.error('Error logging action: ', e);
    }
  };

  const handleAddAsset = async () => {
    const confirmed = window.confirm('Are you sure you want to add this item?');
    if (!confirmed) return;

    if (!newAsset.name || !newAsset.category || !newAsset.description || !newAsset.quantity) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "assets"), newAsset);
      setAssets((prevAssets) => [...prevAssets, { id: docRef.id, ...newAsset }]);
      await logAction('Added', newAsset);
      setIsAdding(false);
      setNewAsset({ name: '', category: '', description: '', quantity: '' });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditClick = (asset) => {
    setSelectedAsset(asset);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const confirmed = window.confirm('Are you sure you want to save changes?');
    if (!confirmed) return;

    try {
      const oldAsset = assets.find((asset) => asset.id === selectedAsset.id);
      const changes = {};

      ['name', 'category', 'description', 'quantity'].forEach((field) => {
        if (oldAsset[field] !== selectedAsset[field]) {
          changes[field] = {
            from: oldAsset[field],
            to: selectedAsset[field],
          };
        }
      });

      const assetRef = doc(db, 'assets', selectedAsset.id);
      await updateDoc(assetRef, selectedAsset);

      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.id === selectedAsset.id ? selectedAsset : asset
        )
      );

      if (Object.keys(changes).length > 0) {
        await logAction('Edited', selectedAsset, changes);
      }

      setSelectedAsset(null);
      alert('Item updated successfully!');
    } catch (e) {
      console.error('Error updating item: ', e);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    try {
      const assetRef = doc(db, 'assets', selectedAsset.id);
      await deleteDoc(assetRef);

      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.id !== selectedAsset.id)
      );

      await logAction('Deleted', selectedAsset);
      setSelectedAsset(null);
      alert('Item deleted successfully!');
    } catch (e) {
      console.error('Error deleting item: ', e);
    }
  };

  const filteredAssets = assets
  .filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'quantity') {
      const qtyA = parseInt(a.quantity);
      const qtyB = parseInt(b.quantity);
      return sortOrder === 'asc' ? qtyA - qtyB : qtyB - qtyA;
    } else if (sortBy === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstAsset, indexOfLastAsset);
  const totalPages = Math.ceil(filteredAssets.length / assetsPerPage);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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
        <h2 className="section-title">Inventory</h2>
        <div className="top-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-btn" onClick={() => setIsAdding(true)}>Add Item +</button>
        </div>
        <table className="styled-table">
          <thead>
            <tr>
            <th
  onClick={() => {
    if (sortBy === 'name') {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('name');
      setSortOrder('asc');
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Item {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
</th>
              <th>Category</th>
              <th>Description</th>
              <th
  onClick={() => {
    if (sortBy === 'quantity') {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy('quantity');
      setSortOrder('asc');
    }
  }}
  style={{ cursor: 'pointer' }}
>
  Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.description}</td>
                <td>{asset.quantity}</td>
                <td><button className="edit-btn" onClick={() => handleEditClick(asset)}>Edit</button></td>
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
              <button onClick={() => setCurrentPage(1)} className={currentPage === 1 ? 'active-page' : ''}>1</button>
              {currentPage > 6 && <span className="ellipsis">...</span>}
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(page => page !== 1 && page !== totalPages && page >= currentPage - 4 && page <= currentPage + 4)
                .map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? 'active-page' : ''}>
                    {page}
                  </button>
                ))}
              {currentPage < totalPages - 5 && <span className="ellipsis">...</span>}
              <button onClick={() => setCurrentPage(totalPages)} className={currentPage === totalPages ? 'active-page' : ''}>
                {totalPages}
              </button>
            </>
          )}
        </div>
      </div>

      {selectedAsset && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h2>Edit Item</h2>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={selectedAsset.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={selectedAsset.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={selectedAsset.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" value={selectedAsset.quantity} onChange={handleChange} />
            </div>
            <div className="edit-form-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setSelectedAsset(null)}>Cancel</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="add-form-overlay">
          <div className="add-form">
            <h2>Add New Item</h2>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={newAsset.category} onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={newAsset.description} onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" value={newAsset.quantity} onChange={(e) => setNewAsset({ ...newAsset, quantity: e.target.value })} />
            </div>
            <div id ="addItem" className="add-form-buttons">
              <button onClick={handleAddAsset}>Add Asset</button>
              <button onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

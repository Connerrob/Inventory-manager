import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import NavbarComponent from '../components/Navbar';
import AssetTable from '../components/Table';
import AddAssetModal from '../components/AddAssetModal';
import { logAction } from '../utils';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();

  const initialAssetState = {
    name: '',
    category: '',
    description: '',
    quantity: '',
    serviceTag: '',
    model: '',
    status: '',
    location: '',
    notes: '',
    macAddress: '',
  };

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAssets = async () => {
      const querySnapshot = await getDocs(collection(db, 'assets'));
      const assetsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssets(assetsList);
    };
    fetchAssets();
  }, []);

  const handleEditClick = (asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (selectedAsset.id) {
      // Edit existing asset
      const assetRef = doc(db, 'assets', selectedAsset.id);
      const oldItem = assets.find((a) => a.id === selectedAsset.id);
  
      await updateDoc(assetRef, selectedAsset);
      setAssets((prev) =>
        prev.map((a) => (a.id === selectedAsset.id ? selectedAsset : a))
      );
  
      await logAction('edit', { oldItem, newItem: selectedAsset });
    } else {
      // Add new asset
      const docRef = await addDoc(collection(db, 'assets'), selectedAsset);
      const newAsset = { ...selectedAsset, id: docRef.id };
  
      setAssets((prev) => [...prev, newAsset]);
  
      await logAction('add', newAsset);
    }
  
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedAsset?.id) return;
    const assetRef = doc(db, 'assets', selectedAsset.id);
  
    await logAction('delete', { oldItem: selectedAsset });
    await deleteDoc(assetRef);
    setAssets((prev) => prev.filter((a) => a.id !== selectedAsset.id));
  
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filtering and Pagination logic
  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col xs={2}>
          <Sidebar
            collapsed={collapsed}
            toggleSidebar={() => setCollapsed(!collapsed)}
            location={location}
          />
        </Col>
        <Col xs={10}>
          <div className="dashboard-header">
            <NavbarComponent
              title="Inventory"
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="table-container">
            <AssetTable
              assets={currentAssets}
              onEditClick={handleEditClick}
              searchQuery={searchQuery}
            />

            {/* Pagination Buttons */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? 'primary' : 'secondary'}
                  onClick={() => handlePageChange(index + 1)}
                  className="page-button"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {/* Add New Asset Button */}
            <Button
              className="add-button"
              onClick={() => {
                setSelectedAsset(initialAssetState);
                setShowModal(true);
              }}
            >
              Add New Asset
            </Button>
          </div>

          <AddAssetModal
            show={showModal}
            onHide={() => setShowModal(false)}
            selectedAsset={selectedAsset}
            onChange={handleChange}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

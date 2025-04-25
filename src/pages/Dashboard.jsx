import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import NavbarComponent from '../components/Navbar';
import AssetTable from '../components/Table';
import AddAssetModal from '../components/AddAssetModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    macAddress: ''
  };
  

  useEffect(() => {
    const fetchAssets = async () => {
      const querySnapshot = await getDocs(collection(db, 'assets'));
      const assetsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    const assetRef = doc(db, 'assets', selectedAsset.id);
    await updateDoc(assetRef, selectedAsset);
    setAssets((prev) => prev.map((asset) => (asset.id === selectedAsset.id ? selectedAsset : asset)));
    setShowModal(false);
  };

  const handleDelete = async () => {
    const assetRef = doc(db, 'assets', selectedAsset.id);
    await deleteDoc(assetRef);
    setAssets((prev) => prev.filter((asset) => asset.id !== selectedAsset.id));
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col xs={2}>
          <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} location={location} />
        </Col>
        <Col xs={10}>
          {/* Pass searchQuery and handleSearchChange to Navbar */}
          <div className="dashboard-header">
            <NavbarComponent title="Inventory" searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          </div>
          <div className="table-container">
            <AssetTable assets={assets} onEditClick={handleEditClick} searchQuery={searchQuery} />
            <Button
  className="add-button"
  onClick={() => {
    setSelectedAsset(initialAssetState); // clear previous data
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

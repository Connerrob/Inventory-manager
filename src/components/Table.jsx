import React from 'react';
import { Button, Table } from 'react-bootstrap';

const AssetTable = ({ assets, onEditClick, searchQuery }) => {
  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredAssets.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.name}</td>
            <td>{asset.category}</td>
            <td>{asset.description}</td>
            <td>{asset.quantity}</td>
            <td>
              <Button onClick={() => onEditClick(asset)} variant="warning">Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AssetTable;

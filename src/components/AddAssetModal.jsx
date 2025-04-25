import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import '../styles/AddAssetModal.css';

const AddAssetModal = ({
  show,
  onHide,
  selectedAsset,
  isAdding,
  onChange,
  onSave,
  onDelete,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isAdding ? 'Add New Asset' : 'Edit Asset'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formAssetName" className="mb-3">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedAsset?.name || ''}
                  onChange={onChange}
                  placeholder="Enter asset name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={selectedAsset?.category || ''}
                  onChange={onChange}
                  placeholder="Enter asset category"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedAsset?.description || ''}
                  onChange={onChange}
                  placeholder="Enter asset description"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formQuantity" className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={selectedAsset?.quantity || ''}
                  onChange={onChange}
                  placeholder="Enter quantity"
                />
              </Form.Group>
            </Col>
          </Row>

          {isAdding && (
            <Row>
              <Col md={12}>
                <Form.Group controlId="formLocation" className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={selectedAsset?.location || ''}
                    onChange={onChange}
                    placeholder="Enter asset location"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onHide} className="me-2">
          Cancel
        </Button>
        {isAdding ? (
          <Button variant="primary" onClick={onSave}>
            Add Asset
          </Button>
        ) : (
          <>
            <Button variant="danger" onClick={onDelete} className="me-2">
              Delete
            </Button>
            <Button variant="success" onClick={onSave}>
              Save Changes
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddAssetModal;

/* eslint-disable react/prop-types */
import { Modal } from 'react-bootstrap';

const Modals = ({ isOpen, onClose, title, children, fullscreen }) => {
  return (
    <Modal fullscreen={fullscreen} show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className='text-black font-bold'>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default Modals;


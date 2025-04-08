// src/components/Modals/DeleteActivityModal.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const DeleteActivityModal = ({ isOpen, toggle, onConfirm, activityName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirmar Exclusão</ModalHeader>
      <ModalBody>
        Tem certeza que deseja excluir a atividade{" "}
        <strong>{activityName}</strong>?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onConfirm}>
          Sim, excluir
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DeleteActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  activityName: PropTypes.string,
};

export default DeleteActivityModal;

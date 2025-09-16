import { useState } from 'react';

export const useFuncionesModals = () => {
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionToDelete, setFuncionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Publish modal state
  const [showModalPublish, setShowModalPublish] = useState(false);
  const [funcionToPublish, setFuncionToPublish] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [funcionToEdit, setFuncionToEdit] = useState(null);

  // Delete modal handlers
  const openDeleteModal = (funcion) => {
    setFuncionToDelete(funcion);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFuncionToDelete(null);
    setIsDeleting(false);
  };

  // Publish modal handlers
  const openPublishModal = (funcion) => {
    setFuncionToPublish(funcion);
    setShowModalPublish(true);
  };

  const closePublishModal = () => {
    setShowModalPublish(false);
    setFuncionToPublish(null);
    setIsPublishing(false);
  };

  // Edit modal handlers
  const openEditModal = (funcion) => {
    setFuncionToEdit(funcion);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setFuncionToEdit(null);
  };

  return {
    // Delete modal
    showDeleteModal,
    funcionToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    
    // Publish modal
    showModalPublish,
    funcionToPublish,
    isPublishing,
    setIsPublishing,
    openPublishModal,
    closePublishModal,
    
    // Edit modal
    showEditModal,
    funcionToEdit,
    openEditModal,
    closeEditModal
  };
};

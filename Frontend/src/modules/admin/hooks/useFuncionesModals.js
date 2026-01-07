import { useState } from 'react';

export const useFuncionesModals = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionToDelete, setFuncionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showModalPublish, setShowModalPublish] = useState(false);
  const [funcionToPublish, setFuncionToPublish] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [funcionToEdit, setFuncionToEdit] = useState(null);

  const openDeleteModal = (funcion) => {
    setFuncionToDelete(funcion);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFuncionToDelete(null);
    setIsDeleting(false);
  };

  const openPublishModal = (funcion) => {
    setFuncionToPublish(funcion);
    setShowModalPublish(true);
  };

  const closePublishModal = () => {
    setShowModalPublish(false);
    setFuncionToPublish(null);
    setIsPublishing(false);
  };

  const openEditModal = (funcion) => {
    setFuncionToEdit(funcion);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setFuncionToEdit(null);
  };

  return {
    showDeleteModal,
    funcionToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    
    showModalPublish,
    funcionToPublish,
    isPublishing,
    setIsPublishing,
    openPublishModal,
    closePublishModal,
    
    showEditModal,
    funcionToEdit,
    openEditModal,
    closeEditModal
  };
};

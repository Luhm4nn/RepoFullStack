import { useState } from 'react';

// Custom hook to manage a unified error modal

export const useErrorModal = () => {
  const [error, setError] = useState({
    show: false,
    type: '',
    message: ''
  });

  const showError = (type, message) => {
    setError({ 
      show: true, 
      type: type || '', 
      message: message || 'Error desconocido' 
    });
  };


  const hideError = () => {
    setError({ 
      show: false, 
      type: '', 
      message: '' 
    });
  };


  const handleApiError = (apiError) => {
    const errorCode = apiError.response?.data?.errorCode;
    const errorMessage = apiError.response?.data?.message || apiError.message || 'Error desconocido';
    
    if (errorCode === 'SOLAPAMIENTO_FUNCIONES' || errorCode === 'FECHA_ESTRENO_INVALIDA') {
      showError(errorCode, errorMessage);
      return true; 
    }
    
    return false; 
  };

  return { 
    error, 
    showError, 
    hideError, 
    handleApiError 
  };
};

import { useState } from 'react';
import { ERROR_CODES } from '../constants/errorCodes';

// Custom hook to manage a unified error modal


const useErrorModal = () => {
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

    if (ERROR_CODES.includes(errorCode)) {
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

export { useErrorModal };
export default useErrorModal;

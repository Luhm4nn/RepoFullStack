import { useState, useEffect } from 'react';

/**
 * Debounce utility - Retrasa la ejecucion de una funcion hasta que pasen X ms sin que se llame
 * @param {Function} func - Funcion a ejecutar
 * @param {number} delay - Tiempo en ms a esperar
 * @returns {Function} - Funcion debounced
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    // Limpia el timeout anterior
    clearTimeout(timeoutId);
    
    // Establece un nuevo timeout
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

/**
 * Hook personalizado para debounce con React
 * @param {any} value - Valor a debounce
 * @param {number} delay - Tiempo en ms
 * @returns {any} - Valor debounced
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

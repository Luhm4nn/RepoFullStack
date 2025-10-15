import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Crear preferencia de pago
export const createPaymentPreference = async (reservaData) => {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/mercadopago/create-preference`, 
      reservaData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment preference:", error);
    throw error;
  }
};

// Verificar estado de un pago
export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.get(
      `${VITE_API_URL}/mercadopago/payment/${paymentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
};
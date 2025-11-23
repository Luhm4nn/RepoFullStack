import api from './axiosInstance.js';

export const createPaymentPreference = async (reservaData) => {
  try {
    const response = await api.post('/mercadopago/create-preference', reservaData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw error;
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/mercadopago/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};
import api from './axiosInstance.js';

export const createPaymentPreference = async (reservaData) => {
  try {
    const response = await api.post('/mercadopago/create-preference', reservaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/mercadopago/payment/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Utility to centralize localStorage management for the reservation flow.
 * Keys:
 * - RESERVA_STEP: 'reserva_step3' (Step 3 state: seats, film, function, etc.)
 * - TIMER_EXPIRY: 'countdown_expiry' (Timestamp when the reservation expires)
 * - MP_PENDING: 'mp_pending_reserva' (Minimal data to verify payment at checkout)
 */

export const STORAGE_KEYS = {
  RESERVA_STEP: 'reserva_step3',
  TIMER_EXPIRY: 'countdown_expiry',
  MP_PENDING: 'mp_pending_reserva',
  RESERVA_ACTIVE: 'active_reserva',
};

export const reservationStorage = {
  /**
   * Saves the active reservation (Modal flow).
   */
  saveActiveReserva: (data) => {
    localStorage.setItem(STORAGE_KEYS.RESERVA_ACTIVE, JSON.stringify(data));
  },

  /**
   * Retrieves active reservation (Modal flow).
   */
  getActiveReserva: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVA_ACTIVE);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * Clears active reservation (Modal flow).
   */
  clearActiveReserva: () => {
    localStorage.removeItem(STORAGE_KEYS.RESERVA_ACTIVE);
  },

  /**
   * Saves the reservation step 3 data and the timer expiry.
   */
  saveStep3: (data, expiryTimestamp) => {
    localStorage.setItem(STORAGE_KEYS.RESERVA_STEP, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.TIMER_EXPIRY, expiryTimestamp.toString());
  },

  /**
   * Saves minimal data needed by the Success/Failure pages to verify Mercado Pago status.
   */
  saveMPPending: (data) => {
    localStorage.setItem(STORAGE_KEYS.MP_PENDING, JSON.stringify(data));
  },

  /**
   * Retrieves full step 3 state.
   */
  getStep3: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVA_STEP);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * Retrieves timer expiry timestamp.
   */
  getExpiry: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.TIMER_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  },

  /**
   * Retrieves minimal MP pending data.
   */
  getMPPending: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.MP_PENDING);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * Clears ALL reservation-related data from localStorage.
   */
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.RESERVA_STEP);
    localStorage.removeItem(STORAGE_KEYS.TIMER_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.MP_PENDING);
    localStorage.removeItem(STORAGE_KEYS.RESERVA_ACTIVE);
  },

  /**
   * Specifically clears MP pending data.
   */
  clearMPPending: () => {
    localStorage.removeItem(STORAGE_KEYS.MP_PENDING);
  },

  /**
   * Checks if a reservation is currently active in step 3 and hasn't expired.
   */
  hasActiveReservation: () => {
    const expiry = reservationStorage.getExpiry();
    return expiry && Date.now() < expiry;
  },
};

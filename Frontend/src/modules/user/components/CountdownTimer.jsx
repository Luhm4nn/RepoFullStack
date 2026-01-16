import { useState, useEffect, useRef, memo } from "react";

/**
 * CountdownTimer
 * @param {number} initialSeconds - Tiempo inicial en segundos
 * @param {function} onExpire - Callback cuando llega a 0
 * @param {string} storageKey - Clave de localStorage para persistir la expiración
 * @param {string} className - Clases extra para el span
 */
const CountdownTimer = memo(function CountdownTimer({ initialSeconds, onExpire, storageKey = "countdown_expiry", className = "" }) {
  // Calcular tiempo restante desde localStorage o inicial
  const getInitialTimeLeft = () => {
    const expiry = localStorage.getItem(storageKey);
    const now = Date.now();
    if (expiry && !isNaN(Number(expiry))) {
      const diff = Math.floor((Number(expiry) - now) / 1000);
      return diff > 0 ? diff : 0;
    } else {
      // Guardar expiración si no existe
      const expiresAt = now + initialSeconds * 1000;
      localStorage.setItem(storageKey, expiresAt);
      return initialSeconds;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      localStorage.removeItem(storageKey);
      onExpire && onExpire();
    }
  }, [timeLeft, onExpire, storageKey]);

  // Si el usuario sale y vuelve, recalcula el tiempo
  useEffect(() => {
    const handleVisibility = () => {
      setTimeLeft(getInitialTimeLeft());
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <span
      id="countdown"
      className={
        "text-4xl font-extrabold font-mono px-6 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-700/30 text-green-300 shadow-lg border-2 border-green-400 tracking-widest transition-all duration-300 animate-pulse " +
        className
      }
      style={{ letterSpacing: '0.15em', minWidth: 140, textAlign: 'center' }}
    >
      {formatTime(Math.max(timeLeft, 0))}
    </span>
  );
});

export default CountdownTimer;

/**
 * OTP Context
 * Manages OTP authentication state and provides OTP-related functions
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { otpApi } from '../services/api/otpApi';
import type { OTPStatus, OTPContextState } from '../shared/types/otp';

interface OTPContextValue extends OTPContextState {
  checkOtp: () => Promise<void>;
  submitOtp: (otp: string) => Promise<boolean>;
  clearError: () => void;
}

const OTPContext = createContext<OTPContextValue | null>(null);

const OTP_POLL_INTERVAL = 30000; // 30 seconds

export const OTPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otpStatus, setOtpStatus] = useState<OTPStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  const checkOtp = useCallback(async () => {
    try {
      const status = await otpApi.getStatus();
      setOtpStatus(status);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setOtpStatus(null);
      setIsAuthenticated(false);
      // Only set error if it's not a "no OTP" case
      if (err instanceof Error && !err.message.includes('404')) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitOtp = useCallback(async (otp: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await otpApi.setOtp(otp);
      if (response.success) {
        // Refresh OTP status after successful submission
        await checkOtp();
        return true;
      } else {
        setError(response.message || 'Failed to set OTP');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit OTP');
      return false;
    }
  }, [checkOtp]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial OTP check
  useEffect(() => {
    checkOtp();
  }, [checkOtp]);

  // Poll for OTP status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      pollIntervalRef.current = window.setInterval(() => {
        checkOtp();
      }, OTP_POLL_INTERVAL);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, checkOtp]);

  // Update TTL countdown locally between polls
  useEffect(() => {
    if (!otpStatus || !isAuthenticated) return;

    const ttlInterval = window.setInterval(() => {
      setOtpStatus(prev => {
        if (!prev) return null;
        const newTtl = prev.ttl - 1;
        if (newTtl <= 0) {
          // OTP expired, trigger re-check
          setIsAuthenticated(false);
          checkOtp();
          return null;
        }
        return { ...prev, ttl: newTtl };
      });
    }, 1000);

    return () => clearInterval(ttlInterval);
  }, [otpStatus?.otp, isAuthenticated, checkOtp]);

  const value: OTPContextValue = {
    isAuthenticated,
    isLoading,
    otpStatus,
    error,
    checkOtp,
    submitOtp,
    clearError
  };

  return (
    <OTPContext.Provider value={value}>
      {children}
    </OTPContext.Provider>
  );
};

export const useOtp = (): OTPContextValue => {
  const context = useContext(OTPContext);
  if (!context) {
    throw new Error('useOtp must be used within an OTPProvider');
  }
  return context;
};

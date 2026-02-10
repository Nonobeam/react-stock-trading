/**
 * OTP Gate Modal Component
 * Full-screen modal that blocks access until valid OTP is entered
 */

import React, { useState, useCallback } from "react";
import { OtpInput } from "./OtpInput";
import { Button } from "./Button";
import "./OtpGateModal.css";

interface OtpGateModalProps {
  isOpen: boolean;
  onSubmit: (otp: string) => Promise<boolean>;
  error: string | null;
  onClearError: () => void;
}

const OTP_LENGTH = 6;

export const OtpGateModal: React.FC<OtpGateModalProps> = ({
  isOpen,
  onSubmit,
  error,
  onClearError,
}) => {
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpChange = useCallback(
    (value: string) => {
      setOtpValue(value);
      if (error) {
        onClearError();
      }
    },
    [error, onClearError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (otpValue.length !== OTP_LENGTH || isSubmitting) return;

      setIsSubmitting(true);
      const success = await onSubmit(otpValue);
      setIsSubmitting(false);

      if (!success) {
        // Clear input on error
        setOtpValue("");
      }
    },
    [otpValue, isSubmitting, onSubmit],
  );

  const isValid = otpValue.length === OTP_LENGTH;

  if (!isOpen) return null;

  return (
    <div className="otp-gate-backdrop">
      <div
        className="otp-gate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-gate-title"
      >
        <div className="otp-gate-modal__icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 id="otp-gate-title" className="otp-gate-modal__title">
          Access Required
        </h1>

        <p className="otp-gate-modal__subtitle">
          Enter your 6-digit access code to continue
        </p>

        <form onSubmit={handleSubmit} className="otp-gate-modal__form">
          <OtpInput
            value={otpValue}
            onChange={handleOtpChange}
            disabled={isSubmitting}
            hasError={!!error}
            autoFocus
          />

          {error && (
            <div className="otp-gate-modal__error" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            className="otp-gate-modal__submit"
          >
            {isSubmitting ? "Verifying..." : "Unlock Access"}
          </Button>
        </form>

        <p className="otp-gate-modal__hint">
          Contact your administrator if you don't have an access code
        </p>
      </div>
    </div>
  );
};

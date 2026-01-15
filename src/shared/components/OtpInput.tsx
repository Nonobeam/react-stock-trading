/**
 * OTP Input Component
 * 6 individual digit boxes with auto-focus, backspace navigation, and paste support
 */

import React, { useRef, useEffect, useCallback } from 'react';
import './OtpInput.css';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

const OTP_LENGTH = 6;

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Focus first empty input when value is cleared
  useEffect(() => {
    if (value === '' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [value]);

  const handleChange = useCallback((index: number, digit: string) => {
    // Only accept digits
    if (digit && !/^\d$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    
    // Fill empty positions with empty string
    while (newValue.length < OTP_LENGTH) {
      newValue.push('');
    }

    const result = newValue.join('').slice(0, OTP_LENGTH);
    onChange(result);

    // Auto-advance to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current input is empty, move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pastedData) {
      onChange(pastedData);
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  }, [onChange]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <div className="otp-input">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          className={`otp-input__digit ${value[index] ? 'otp-input__digit--filled' : ''} ${hasError ? 'otp-input__digit--error' : ''}`}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

/**
 * OTP Badge Component
 * Small badge displaying current OTP and TTL countdown in navbar
 */

import React from "react";
import "./OtpBadge.css";

interface OtpBadgeProps {
  otp: string;
  ttl: number; // seconds remaining
}

const formatTTL = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const OtpBadge: React.FC<OtpBadgeProps> = ({ otp, ttl }) => {
  const isLowTTL = ttl <= 60;
  const isCriticalTTL = ttl <= 30;

  return (
    <div
      className={`otp-badge ${isLowTTL ? "otp-badge--warning" : ""} ${isCriticalTTL ? "otp-badge--critical" : ""}`}
    >
      <div className="otp-badge__icon">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <span className="otp-badge__code">{otp}</span>
      <span className="otp-badge__separator">·</span>
      <span className="otp-badge__ttl">{formatTTL(ttl)}</span>
    </div>
  );
};

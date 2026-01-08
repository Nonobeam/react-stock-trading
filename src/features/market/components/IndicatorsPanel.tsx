import React from 'react';
import type { TechnicalIndicators } from '../../../shared/types';
import { TradingTerm } from '../../../shared/components';
import './IndicatorsPanel.css';

interface IndicatorsPanelProps {
  indicators: TechnicalIndicators | null;
  isLoading?: boolean;
}

export const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({
  indicators,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="indicators-panel loading">
        <p>Loading indicators...</p>
      </div>
    );
  }

  if (!indicators) {
    return (
      <div className="indicators-panel empty">
        <p>No indicator data available</p>
      </div>
    );
  }

  const getRSIStatus = (rsi: number) => {
    if (rsi >= 70) return { label: 'Overbought', class: 'danger' };
    if (rsi <= 30) return { label: 'Oversold', class: 'success' };
    return { label: 'Neutral', class: 'neutral' };
  };

  const getADXStatus = (adx: number) => {
    if (adx >= 25) return { label: 'Strong Trend', class: 'success' };
    if (adx >= 20) return { label: 'Moderate Trend', class: 'warning' };
    return { label: 'Weak Trend', class: 'neutral' };
  };

  const rsiStatus = getRSIStatus(indicators.rsi);
  const adxStatus = getADXStatus(indicators.adx);

  return (
    <div className="indicators-panel">
      <div className="indicators-grid">
        {/* RSI */}
        <div className="indicator-card">
          <h4><TradingTerm term="RSI">RSI (14)</TradingTerm></h4>
          <div className="indicator-value">
            <span className={`value ${rsiStatus.class}`}>{indicators.rsi.toFixed(2)}</span>
            <span className={`status ${rsiStatus.class}`}>{rsiStatus.label}</span>
          </div>
          <div className="indicator-bar">
            <div
              className="indicator-fill"
              style={{
                width: `${indicators.rsi}%`,
                backgroundColor: rsiStatus.class === 'danger' ? '#ef5350' : 
                                rsiStatus.class === 'success' ? '#26a69a' : '#9e9e9e'
              }}
            />
          </div>
        </div>

        {/* MACD */}
        <div className="indicator-card">
          <h4><TradingTerm term="MACD">MACD</TradingTerm></h4>
          <div className="indicator-values">
            <div className="value-row">
              <span className="label">Value:</span>
              <span className={indicators.macd.value >= 0 ? 'positive' : 'negative'}>
                {indicators.macd.value.toFixed(2)}
              </span>
            </div>
            <div className="value-row">
              <span className="label">Signal:</span>
              <span>{indicators.macd.signal.toFixed(2)}</span>
            </div>
            <div className="value-row">
              <span className="label">Histogram:</span>
              <span className={indicators.macd.histogram >= 0 ? 'positive' : 'negative'}>
                {indicators.macd.histogram.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Stochastic */}
        <div className="indicator-card">
          <h4><TradingTerm term="STOCHASTIC">Stochastic</TradingTerm></h4>
          <div className="indicator-values">
            <div className="value-row">
              <span className="label">%K:</span>
              <span>{indicators.stochastic.k.toFixed(2)}</span>
            </div>
            <div className="value-row">
              <span className="label">%D:</span>
              <span>{indicators.stochastic.d.toFixed(2)}</span>
            </div>
            <div className="value-row">
              <span className="label">Status:</span>
              <span className={
                indicators.stochastic.k > 80 ? 'danger' :
                indicators.stochastic.k < 20 ? 'success' : 'neutral'
              }>
                {indicators.stochastic.k > 80 ? 'Overbought' :
                 indicators.stochastic.k < 20 ? 'Oversold' : 'Neutral'}
              </span>
            </div>
          </div>
        </div>

        {/* ADX */}
        <div className="indicator-card">
          <h4><TradingTerm term="ADX">ADX (14)</TradingTerm></h4>
          <div className="indicator-value">
            <span className={`value ${adxStatus.class}`}>{indicators.adx.toFixed(2)}</span>
            <span className={`status ${adxStatus.class}`}>{adxStatus.label}</span>
          </div>
        </div>

        {/* ATR */}
        <div className="indicator-card">
          <h4><TradingTerm term="ATR">ATR (14)</TradingTerm></h4>
          <div className="indicator-value">
            <span className="value">{indicators.atr.toFixed(2)}</span>
            <span className="status neutral">Volatility</span>
          </div>
        </div>

        {/* VWAP */}
        <div className="indicator-card">
          <h4><TradingTerm term="VWAP">VWAP</TradingTerm></h4>
          <div className="indicator-value">
            <span className="value">{indicators.vwap.toFixed(2)}</span>
            <span className="status neutral">Volume Weighted</span>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="indicator-card">
          <h4><TradingTerm term="BOLLINGER_BANDS">Bollinger Bands</TradingTerm></h4>
          <div className="indicator-values">
            <div className="value-row">
              <span className="label">Upper:</span>
              <span>{indicators.bollingerBands.upper.toFixed(2)}</span>
            </div>
            <div className="value-row">
              <span className="label">Middle:</span>
              <span>{indicators.bollingerBands.middle.toFixed(2)}</span>
            </div>
            <div className="value-row">
              <span className="label">Lower:</span>
              <span>{indicators.bollingerBands.lower.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* OBV (if available) */}
        {indicators.obv !== undefined && (
          <div className="indicator-card">
            <h4><TradingTerm term="OBV">OBV</TradingTerm></h4>
            <div className="indicator-value">
              <span className="value">{indicators.obv.toLocaleString()}</span>
              <span className="status neutral">Volume Flow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

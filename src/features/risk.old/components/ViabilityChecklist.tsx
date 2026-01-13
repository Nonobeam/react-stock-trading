import React from 'react';
import { validateStopPrice } from '../../../services/vietnam/priceLimit';
import type { Exchange } from '../../../services/vietnam/priceLimit';
import { isValidLotSize } from '../../../services/vietnam/lotSize';
import { meetsRRRequirements } from '../utils/rrValidation';
import { Badge } from '../../../shared/components/Badge';

export interface ViabilityCheck {
  id: string;
  label: string;
  passed: boolean;
  critical: boolean;
  message: string;
}

interface ViabilityChecklistProps {
  capital: number;
  positionValue: number;
  positionSize: number;
  entryPrice: number;
  stopPrice: number;
  targets: number[];
  exchange: Exchange;
  actualRiskPercent: number;
}

export const ViabilityChecklist: React.FC<ViabilityChecklistProps> = ({
  capital,
  positionValue,
  positionSize,
  entryPrice,
  stopPrice,
  targets,
  exchange,
  actualRiskPercent
}) => {
  const checks = React.useMemo<ViabilityCheck[]>(() => {
    const results: ViabilityCheck[] = [];

    // Critical Check 1: Stop price within Vietnam limits
    const stopValidation = validateStopPrice(entryPrice, stopPrice, exchange);
    results.push({
      id: 'stop-limit',
      label: 'Stop within Vietnam price limits',
      passed: stopValidation.valid,
      critical: true,
      message: stopValidation.valid 
        ? `Stop price ${stopPrice} is within ${exchange} daily limits`
        : stopValidation.reason || 'Stop exceeds daily limit'
    });

    // Critical Check 2: Position size is lot-compliant
    const lotValid = isValidLotSize(positionSize);
    results.push({
      id: 'lot-size',
      label: 'Position size is lot-compliant (100 shares)',
      passed: lotValid,
      critical: true,
      message: lotValid
        ? `Position size ${positionSize} shares is valid (${positionSize / 100} lots)`
        : `Position size ${positionSize} is not a multiple of 100`
    });

    // Critical Check 3: Sufficient capital
    const sufficientCapital = positionValue <= capital;
    results.push({
      id: 'capital',
      label: 'Sufficient capital for position',
      passed: sufficientCapital,
      critical: true,
      message: sufficientCapital
        ? `Position value ${positionValue.toLocaleString()} ≤ Capital ${capital.toLocaleString()}`
        : `Insufficient capital: need ${positionValue.toLocaleString()}, have ${capital.toLocaleString()}`
    });

    // Critical Check 4: Risk:Reward ratio acceptable
    const rrValid = meetsRRRequirements(entryPrice, stopPrice, targets);
    results.push({
      id: 'rr-ratio',
      label: 'Minimum R:R ratio met (≥1.5:1)',
      passed: rrValid,
      critical: true,
      message: rrValid
        ? 'At least one target meets minimum 1.5:1 R:R'
        : 'No targets meet minimum 1.5:1 R:R requirement'
    });

    // Warning Check 1: Risk percentage
    const riskOk = actualRiskPercent <= 2;
    results.push({
      id: 'risk-percent',
      label: 'Risk per trade ≤2%',
      passed: riskOk,
      critical: false,
      message: riskOk
        ? `Risk ${actualRiskPercent.toFixed(2)}% is within recommended range`
        : `Risk ${actualRiskPercent.toFixed(2)}% exceeds recommended 2% maximum`
    });

    // Warning Check 2: Minimum position size
    const minPositionOk = positionSize >= 100;
    results.push({
      id: 'min-position',
      label: 'Position size ≥100 shares',
      passed: minPositionOk,
      critical: false,
      message: minPositionOk
        ? `Position size ${positionSize} meets minimum`
        : `Position size ${positionSize} below minimum 100 shares`
    });

    // Warning Check 3: Position concentration
    const concentration = (positionValue / capital) * 100;
    const concentrationOk = concentration <= 20;
    results.push({
      id: 'concentration',
      label: 'Position ≤20% of capital',
      passed: concentrationOk,
      critical: false,
      message: concentrationOk
        ? `Position is ${concentration.toFixed(1)}% of capital`
        : `Position is ${concentration.toFixed(1)}% of capital (>20% is high concentration)`
    });

    return results;
  }, [capital, positionValue, positionSize, entryPrice, stopPrice, targets, exchange, actualRiskPercent]);

  const criticalChecks = checks.filter(c => c.critical);
  const warningChecks = checks.filter(c => !c.critical);
  
  const allCriticalPassed = criticalChecks.every(c => c.passed);
  const failedCriticalCount = criticalChecks.filter(c => !c.passed).length;
  const failedWarningCount = warningChecks.filter(c => !c.passed).length;

  return (
    <div className="viability-checklist">
      <div className="checklist-header">
        <h3>Pre-Trade Viability</h3>
        <div className={`overall-status ${allCriticalPassed ? 'viable' : 'not-viable'}`}>
          <Badge variant={allCriticalPassed ? 'success' : 'danger'}>
            {allCriticalPassed ? 'Viable' : 'Not Viable'}
          </Badge>
        </div>
      </div>

      <div className="checklist-summary">
        <div className="summary-item">
          <span className="summary-label">Critical Checks:</span>
          <span className={`summary-value ${failedCriticalCount === 0 ? 'pass' : 'fail'}`}>
            {criticalChecks.filter(c => c.passed).length}/{criticalChecks.length} passed
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Warnings:</span>
          <span className={`summary-value ${failedWarningCount === 0 ? 'pass' : 'warning'}`}>
            {warningChecks.filter(c => c.passed).length}/{warningChecks.length} passed
          </span>
        </div>
      </div>

      <div className="checks-section">
        <h4 className="section-title">Critical Requirements</h4>
        <div className="checks-list">
          {criticalChecks.map(check => (
            <div key={check.id} className={`check-item ${check.passed ? 'passed' : 'failed'}`}>
              <div className="check-header">
                <Badge variant={check.passed ? 'success' : 'danger'} size="small">
                  {check.passed ? 'Passed' : 'Failed'}
                </Badge>
                <span className="check-label">{check.label}</span>
              </div>
              <div className="check-message">{check.message}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="checks-section">
        <h4 className="section-title">Best Practices</h4>
        <div className="checks-list">
          {warningChecks.map(check => (
            <div key={check.id} className={`check-item ${check.passed ? 'passed' : 'warning'}`}>
              <div className="check-header">
                <Badge variant={check.passed ? 'success' : 'warning'} size="small">
                  {check.passed ? 'Passed' : 'Warning'}
                </Badge>
                <span className="check-label">{check.label}</span>
              </div>
              <div className="check-message">{check.message}</div>
            </div>
          ))}
        </div>
      </div>

      {!allCriticalPassed && (
        <div className="cannot-proceed">
          <Badge variant="danger">Cannot proceed with trade</Badge>
          <p>Please fix all critical requirements before executing this trade.</p>
        </div>
      )}

      {allCriticalPassed && failedWarningCount > 0 && (
        <div className="proceed-with-caution">
          <Badge variant="warning">Proceed with caution</Badge>
          <p>{failedWarningCount} best practice warning(s). Review carefully before executing.</p>
        </div>
      )}
    </div>
  );
};

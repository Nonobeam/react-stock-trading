import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adjustToLotSize, LOT_SIZE } from '../../../services/vietnam/lotSize';

const riskCalculatorSchema = z.object({
  capital: z.number().positive('Capital must be positive'),
  riskPercent: z.number().min(0.1, 'Minimum 0.1%').max(5, 'Maximum 5%'),
  entryPrice: z.number().positive('Entry price must be positive'),
  stopPrice: z.number().positive('Stop price must be positive'),
}).refine(
  (data) => data.stopPrice < data.entryPrice,
  { message: "Stop must be below entry", path: ["stopPrice"] }
);

type RiskCalculatorFormData = z.infer<typeof riskCalculatorSchema>;

interface PositionSizeCalculatorProps {
  initialValues?: Partial<RiskCalculatorFormData>;
  onCalculate: (calculation: PositionCalculation) => void;
}

export interface PositionCalculation {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopPrice: number;
  positionSize: number;
  positionValue: number;
  riskAmount: number;
  actualRiskPercent: number;
  riskPerShare: number;
  lots: number;
}

export const PositionSizeCalculator: React.FC<PositionSizeCalculatorProps> = ({
  initialValues,
  onCalculate
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RiskCalculatorFormData>({
    resolver: zodResolver(riskCalculatorSchema),
    defaultValues: {
      capital: initialValues?.capital || 100000000,
      riskPercent: initialValues?.riskPercent || 1,
      entryPrice: initialValues?.entryPrice || 0,
      stopPrice: initialValues?.stopPrice || 0,
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Real-time calculation
  React.useEffect(() => {
    const { capital, riskPercent, entryPrice, stopPrice } = formValues;
    
    if (capital > 0 && riskPercent > 0 && entryPrice > 0 && stopPrice > 0 && stopPrice < entryPrice) {
      const riskAmount = capital * (riskPercent / 100);
      const riskPerShare = entryPrice - stopPrice;
      const idealShares = riskAmount / riskPerShare;
      const positionSize = adjustToLotSize(idealShares);
      const positionValue = positionSize * entryPrice;
      const actualRiskAmount = positionSize * riskPerShare;
      const actualRiskPercent = (actualRiskAmount / capital) * 100;
      const lots = positionSize / LOT_SIZE;

      const calculation: PositionCalculation = {
        capital,
        riskPercent,
        entryPrice,
        stopPrice,
        positionSize,
        positionValue,
        riskAmount: actualRiskAmount,
        actualRiskPercent,
        riskPerShare,
        lots
      };

      onCalculate(calculation);
    }
  }, [formValues, onCalculate]);

  const onSubmit = (data: RiskCalculatorFormData) => {
    // Form is valid, calculation already sent via useEffect
    console.log('Form submitted:', data);
  };

  return (
    <div className="position-size-calculator">
      <h3 className="calculator-title">Position Size Calculator</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="calculator-form">
        <div className="form-group">
          <label htmlFor="capital">Trading Capital (VND)</label>
          <input
            id="capital"
            type="number"
            {...register('capital', { valueAsNumber: true })}
            className={errors.capital ? 'error' : ''}
          />
          {errors.capital && (
            <span className="error-message">{errors.capital.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="riskPercent">Risk Per Trade (%)</label>
          <input
            id="riskPercent"
            type="number"
            step="0.1"
            {...register('riskPercent', { valueAsNumber: true })}
            className={errors.riskPercent ? 'error' : ''}
          />
          {errors.riskPercent && (
            <span className="error-message">{errors.riskPercent.message}</span>
          )}
          <small className="hint">Recommended: 1-2% per trade</small>
        </div>

        <div className="form-group">
          <label htmlFor="entryPrice">Entry Price (VND)</label>
          <input
            id="entryPrice"
            type="number"
            step="100"
            {...register('entryPrice', { valueAsNumber: true })}
            className={errors.entryPrice ? 'error' : ''}
          />
          {errors.entryPrice && (
            <span className="error-message">{errors.entryPrice.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="stopPrice">Stop Loss Price (VND)</label>
          <input
            id="stopPrice"
            type="number"
            step="100"
            {...register('stopPrice', { valueAsNumber: true })}
            className={errors.stopPrice ? 'error' : ''}
          />
          {errors.stopPrice && (
            <span className="error-message">{errors.stopPrice.message}</span>
          )}
        </div>
      </form>
    </div>
  );
};

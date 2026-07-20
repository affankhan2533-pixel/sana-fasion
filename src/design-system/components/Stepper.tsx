'use client';
import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  const currentLabel = steps[currentStep - 1] || steps[0];

  return (
    <div className="w-full">
      {/* 📱 Mobile Sleek Progress Header */}
      <div className="md:hidden space-y-2">
        <div className="flex justify-between items-center text-[12px] font-bold">
          <span className="text-[#C8851A] tracking-wider uppercase text-[10px]">Step {currentStep} of {steps.length}</span>
          <span className="text-[#1C1008] font-serif text-[15px]">{currentLabel}</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#C8851A] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 🖥️ Desktop Luxury Multi-step Navigation Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-2xl mx-auto py-1">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 flex-shrink-0 ${
                    isCurrent
                      ? 'bg-[#C8851A] text-white shadow-sm ring-4 ring-[#C8851A]/15'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-[#E8E2D9] text-[#9B8E7E]'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNum}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[11px] uppercase tracking-wider font-bold leading-tight ${
                    isCurrent ? 'text-[#C8851A]' : isCompleted ? 'text-[#1C1008]' : 'text-[#9B8E7E]'
                  }`}>
                    {label}
                  </span>
                  <span className="text-[9px] text-[#9B8E7E] font-medium">
                    {stepNum === 1 ? 'Details' : stepNum === 2 ? 'Media' : stepNum === 3 ? 'Inventory' : 'Review'}
                  </span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 transition-colors duration-300 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-[#E8E2D9]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
export type { StepperProps };

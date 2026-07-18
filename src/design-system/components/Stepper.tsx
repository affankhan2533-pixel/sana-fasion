'use client';
import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto py-2">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 flex-1 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#C8851A] text-white border-[#C8851A] scale-110 shadow-sm'
                    : isActive
                    ? 'bg-amber-50 text-[#C8851A] border-[#C8851A]'
                    : 'bg-white border-[#E8E2D9] text-[#9B8E7E]'
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-[9px] uppercase tracking-wider font-bold transition-colors ${
                  isActive ? 'text-[#1C1008]' : 'text-[#9B8E7E]'
                }`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-4 transition-colors duration-300 ${
                  stepNum < currentStep ? 'bg-[#C8851A]' : 'bg-[#E8E2D9]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export type { StepperProps };

'use client';
import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-4 px-1 select-none">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#FAF6F0] z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C8851A] transition-all duration-500 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          
          return (
            <div key={stepName} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 border ${
                  isCompleted 
                    ? 'bg-[#C8851A] border-[#C8851A] text-white shadow-sm' 
                    : isActive 
                    ? 'bg-white border-[#C8851A] text-[#C8851A] shadow-md scale-105' 
                    : 'bg-white border-[#E8E2D9] text-[#9B8E7E]'
                }`}
              >
                {stepNum}
              </div>
              <span 
                className={`text-[9px] uppercase font-bold tracking-wider mt-1.5 transition-colors ${
                  isActive ? 'text-[#C8851A]' : isCompleted ? 'text-[#1C1008]' : 'text-[#9B8E7E]'
                }`}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

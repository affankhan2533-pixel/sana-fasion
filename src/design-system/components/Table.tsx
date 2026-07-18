'use client';
import React from 'react';
import { cn } from '../utils/cn';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children, className = '', ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto border border-[#E8E2D9] rounded-[12px] bg-white shadow-sm">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        <thead>
          <tr className="border-b border-[#E8E2D9] bg-[#FCFAF7]">
            {headers.map((h, idx) => (
              <th key={idx} className="px-5 py-3.5 text-[10px] font-bold text-[#6B5E4C] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#FAF6F0] text-[13px] text-[#1C1008]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

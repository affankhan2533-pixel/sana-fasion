'use client';
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#F0EDE8]/80 rounded-[8px] ${className}`} />
  );
}

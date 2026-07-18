'use client';
import React from 'react';
import Link from 'next/link';
import { Edit, Package, Trash } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

interface ProductCardProps {
  product: any;
  onSelect: () => void;
  onToggleStock: () => void;
  onDelete: () => void;
}

export default function ProductCard({ product, onSelect, onToggleStock, onDelete }: ProductCardProps) {
  const isOut = product.stock === 0;

  return (
    <div className="bg-white border border-[#E6C280]/20 rounded-[12px] p-5 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-200 justify-between relative">
      
      {/* Upper Content wrapper */}
      <div className="space-y-4">
        {/* Fixed Aspect ratio cover image */}
        <div 
          onClick={onSelect}
          className="relative aspect-[4/5] w-full rounded-[8px] overflow-hidden bg-gray-50 border border-[#E6C280]/10 flex-shrink-0 cursor-pointer"
        >
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#9B8E7E] gap-1.5">
              <Package size={32} />
              <span className="text-[10px] uppercase font-bold tracking-wider">No photo</span>
            </div>
          )}

          {/* Badges Overlays */}
          {/* Status Badge (top left) */}
          <div className="absolute top-3 left-3 z-10">
            <Badge type={isOut ? 'out_of_stock' : 'in_stock'} className="text-[12px]" />
          </div>
          {/* Published Badge (top right) */}
          <div className="absolute top-3 right-3 z-10">
            <Badge type={product.status || 'draft'} className="text-[12px]" />
          </div>
        </div>

        {/* Details Stack (16px spacing from image above) */}
        <div onClick={onSelect} className="space-y-1 cursor-pointer">
          <h3 className="font-semibold text-[16px] text-[#1C1008] leading-snug truncate">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#9B8E7E] font-medium leading-none">
            {product.category}
          </p>
          <div className="pt-1">
            <span className="text-[18px] font-bold text-[#C8851A]">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons actions bar (20px spacing from details above) */}
      <div className="grid grid-cols-3 gap-2.5 pt-5">
        <Link href={`/admin/products/${product._id}`} className="w-full">
          <Button 
            variant="primary" 
            size="sm" 
            className="w-full text-[12px] font-semibold uppercase tracking-wider" 
            icon={<Edit size={13} />}
          >
            Edit
          </Button>
        </Link>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onToggleStock} 
          className="w-full text-[12px] font-semibold uppercase tracking-wider" 
          icon={<Package size={13} />}
        >
          Stock
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={onDelete} 
          className="w-full text-[12px] font-semibold uppercase tracking-wider" 
          icon={<Trash size={13} />}
        >
          Delete
        </Button>
      </div>

    </div>
  );
}
export type { ProductCardProps };

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
    <div className="bg-white border border-[#E6C280]/20 rounded-[12px] overflow-hidden shadow-sm flex flex-col relative hover:shadow-md transition-all duration-200">
      {/* Tappable Image area */}
      <div onClick={onSelect} className="cursor-pointer flex-1 flex flex-col">
        {/* Product Image Cover */}
        <div className="aspect-[4/5] w-full bg-gray-50 border-b border-[#E6C280]/10 overflow-hidden relative">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#9B8E7E] gap-1.5">
              <Package size={32} />
              <span className="text-[10px] uppercase font-bold tracking-wider">No photo</span>
            </div>
          )}
          
          {/* Badge Overlays */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
            <Badge type={isOut ? 'out_of_stock' : 'in_stock'} />
            {product.featured && <Badge type="featured" />}
          </div>
          <div className="absolute top-3 right-3 z-10">
            <Badge type={product.status} />
          </div>
        </div>

        {/* Details Area */}
        <div className="p-4 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif font-semibold text-[16px] text-[#1C1008] leading-tight truncate" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {product.name}
            </h3>
            <span className="font-serif text-[15px] font-bold text-[#C8851A] whitespace-nowrap">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-[#9B8E7E] tracking-wider uppercase font-semibold">{product.category} {product.fabric ? `• ${product.fabric}` : ''}</p>
        </div>
      </div>

      {/* Symmetrical actions bar */}
      <div className="bg-[#FAF6F0] p-3 border-t border-[#E6C280]/15 grid grid-cols-3 gap-2">
        <Link href={`/admin/products/${product._id}`} className="w-full">
          <Button variant="secondary" className="h-11 w-full text-[11px] px-0" icon={<Edit size={12} />}>
            Edit
          </Button>
        </Link>
        <Button variant="secondary" onClick={onToggleStock} className="h-11 w-full text-[11px] px-0" icon={<Package size={12} />}>
          Stock
        </Button>
        <Button variant="danger" onClick={onDelete} className="h-11 w-full text-[11px] px-0" icon={<Trash size={12} />}>
          Delete
        </Button>
      </div>
    </div>
  );
}

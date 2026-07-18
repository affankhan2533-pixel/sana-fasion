export const buttonVariants = {
  variant: {
    primary: 'bg-[#C8851A] text-white hover:bg-[#B07414] border border-transparent',
    secondary: 'bg-white border border-[#C8851A]/40 text-[#C8851A] hover:bg-[#FAF8F5] hover:border-[#C8851A]',
    danger: 'bg-white border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]',
  },
  size: {
    default: 'h-[52px] px-6 text-[13px] rounded-[12px]',
    sm: 'h-11 px-4 text-[12px] rounded-[10px]',
    lg: 'h-14 px-8 text-[14px] rounded-[12px]',
  }
} as const;

export const badgeVariants = {
  in_stock: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
  resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
  out_of_stock: 'bg-red-50 text-red-700 border border-red-100/50',
  archived: 'bg-red-50 text-red-700 border border-red-100/50',
  featured: 'bg-amber-50/70 text-[#C8851A] border border-[#E6C280]/25',
  new: 'bg-amber-50/70 text-[#C8851A] border border-[#E6C280]/25',
  draft: 'bg-gray-50 text-gray-600 border border-gray-200',
} as const;

export type ButtonVariant = keyof typeof buttonVariants.variant;
export type ButtonSize = keyof typeof buttonVariants.size;
export type BadgeType = keyof typeof badgeVariants;

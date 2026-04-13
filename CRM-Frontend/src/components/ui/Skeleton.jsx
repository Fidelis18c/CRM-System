import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#f3f4f6]", className)}
      {...props}
    />
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-[#e5e7eb]">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-5">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton = () => (
  <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 space-y-4">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-3/4" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-[350px] w-full flex items-end space-x-2 px-4 pb-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton 
        key={i} 
        className="flex-1" 
        style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
      />
    ))}
  </div>
);

export default Skeleton;

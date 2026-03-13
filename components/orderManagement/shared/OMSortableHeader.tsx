"use client";
 
 import { TableHead } from "@/components/ui/table";
 import { cn } from "@/lib/utils";
 import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
 
 interface OMSortableHeaderProps {
   title: string;
   currentSort: string;
   onSort: (newSort: any) => void;
   ascOption: string;
   descOption: string;
   className?: string;
 }
 
 export function OMSortableHeader({
   title,
   currentSort,
   onSort,
   ascOption,
   descOption,
   className,
 }: OMSortableHeaderProps) {
   const isAsc = currentSort === ascOption;
   const isDesc = currentSort === descOption;
 
   const handleToggle = () => {
     if (isAsc) {
       onSort(descOption);
     } else {
       onSort(ascOption);
     }
   };
 
   const getSortIcon = () => {
     if (isAsc) return <ArrowUp className="h-4 w-4" />;
     if (isDesc) return <ArrowDown className="h-4 w-4" />;
     return <ArrowUpDown className="h-4 w-4 opacity-50" />;
   };
 
   return (
     <TableHead
       className={cn(
         "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 group whitespace-nowrap",
         (isAsc || isDesc) && "text-foreground font-semibold",
         className
       )}
       onClick={handleToggle}
     >
       <div className="flex items-center gap-2">
         {title}
         <span className="shrink-0 group-hover:opacity-100 transition-opacity">
           {getSortIcon()}
         </span>
       </div>
     </TableHead>
   );
 }

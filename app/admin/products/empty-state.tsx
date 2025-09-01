import { Package } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium">No products found</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

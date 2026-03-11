import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, Package, Truck, Info, Move } from "lucide-react";
import { OMShipmentBox, OMShipmentHelpers } from "@/types/order-management";
import { cn } from "@/lib/utils";

interface OMShipmentPackingViewProps {
  shipmentBoxes: OMShipmentBox[];
  totalDispatchQty: number;
  isLoading?: boolean;
}

export const OMShipmentPackingView: React.FC<OMShipmentPackingViewProps> = ({
  shipmentBoxes,
  totalDispatchQty,
  isLoading = false,
}) => {
  if (isLoading) {
    return <OMShipmentPackingSkeleton />;
  }

  if (!shipmentBoxes || shipmentBoxes.length === 0) {
    return (
      <Card className="border-2 border-dashed border-muted bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-3 bg-muted rounded-full mb-4">
            <Package className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">No Packing Details</h4>
          <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
            No shipment boxes or packing configurations have been added to this dispatch yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalBoxes = OMShipmentHelpers.getTotalBoxes(shipmentBoxes);
  const totalVolume = OMShipmentHelpers.getTotalVolume(shipmentBoxes);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5 bg-white/50 backdrop-blur-sm">
        <CardHeader className="border-b border-black/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-900 rounded-lg shadow-neutral-200 shadow-lg">
              <Box className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Shipment / Packing Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Detailed packing information for this dispatch
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Packing Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryStat
              label="Total Boxes"
              value={totalBoxes}
              icon={<Box className="h-4 w-4" />}
              gradient="from-neutral-800 to-neutral-900"
            />
            <SummaryStat
              label="Box Types"
              value={shipmentBoxes.length}
              icon={<Package className="h-4 w-4" />}
              gradient="from-gray-500 to-gray-600"
            />
            <SummaryStat
              label="Total Volume"
              value={`${totalVolume.toFixed(3)} m³`}
              icon={<Move className="h-4 w-4" />}
              gradient="from-slate-500 to-slate-600"
            />
            <SummaryStat
              label="Items Packed"
              value={totalDispatchQty}
              icon={<Truck className="h-4 w-4" />}
              gradient="from-gray-600 to-gray-700"
            />
          </div>

          {/* Individual Box Details */}
          <div className="space-y-4">
            {shipmentBoxes.map((box) => {
              const volumePerBox = OMShipmentHelpers.calculateBoxVolume(box);
              const totalVolume = volumePerBox * box.numberOfBoxes;
              return (
                <Card key={box.boxId} className="border-2 border-muted transition-all duration-300 hover:border-neutral-300 hover:shadow-md">
                  <CardHeader className="pb-3 bg-muted/20">
                    <div className="flex items-center justify-around">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold text-sm">
                          {box.boxNumber}
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">Box {box.boxNumber}</CardTitle>
                          {box.numberOfBoxes > 1 && (
                            <p className="text-xs text-neutral-600 font-medium mt-0.5">
                              {box.numberOfBoxes} identical boxes
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-neutral-50 text-neutral-900 border-neutral-200 px-2.5 py-0.5 text-xs font-mono">
                        {box.length} × {box.width} × {box.height} cm
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Dimensions Glassmorphism Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       <DimensionTile label="Length" value={`${box.length} cm`} />
                       <DimensionTile label="Width" value={`${box.width} cm`} />
                       <DimensionTile label="Height" value={`${box.height} cm`} />
                       <DimensionTile 
                         label="Volume" 
                         value={`${volumePerBox.toFixed(4)} m³`}
                         subValue={box.numberOfBoxes > 1 ? `Total: ${totalVolume.toFixed(4)} m³` : undefined}
                         isHighlight
                       />
                    </div>

                    {/* Contents Table */}
                    <div className="rounded-md border border-muted bg-white">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="h-9 px-4 text-xs">Item Name</TableHead>
                            <TableHead className="h-9 px-4 text-right text-xs">Qty per Box</TableHead>
                            {box.numberOfBoxes > 1 && (
                              <TableHead className="h-9 px-4 text-right text-xs">Total Qty</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {box.contents.map((content, index) => (
                            <TableRow key={index} className="hover:bg-neutral-50 transition-colors">
                              <TableCell className="py-2 px-4 text-sm font-medium">{content.itemName}</TableCell>
                              <TableCell className="py-2 px-4 text-right text-sm">{content.quantity}</TableCell>
                              {box.numberOfBoxes > 1 && (
                                <TableCell className="py-2 px-4 text-right text-sm font-bold text-neutral-900">
                                  {content.quantity * box.numberOfBoxes}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Instructions for Client */}
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <Info className="h-4 w-4 text-amber-700" />
            <AlertDescription className="pt-1">
              <p className="text-sm font-bold text-amber-900 mb-1.5 flex items-center gap-2">
                📦 For Client Reference:
              </p>
              <ul className="text-sm space-y-1 text-amber-800/90 list-disc list-inside marker:text-amber-500">
                <li>Total shipment consists of <span className="font-bold">{totalBoxes}</span> box(es)</li>
                <li>Please verify contents of each box upon delivery</li>
                <li>Box dimensions provided for storage planning</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

const SummaryStat = ({ label, value, icon, gradient }: { label: string, value: string | number, icon: React.ReactNode, gradient: string }) => (
  <div className="relative overflow-hidden p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
    <div className={cn("absolute top-0 right-0 w-12 h-12 -mr-3 -mt-3 opacity-10 flex items-center justify-center rounded-full bg-linear-to-br", gradient)}>
      {icon}
    </div>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
  </div>
);

const DimensionTile = ({ label, value, subValue, isHighlight = false }: { label: string, value: string, subValue?: string, isHighlight?: boolean }) => (
  <div className={cn(
    "p-3 rounded-lg border transition-all",
    isHighlight ? "bg-neutral-50 border-neutral-200 shadow-sm" : "bg-muted/40 border-transparent"
  )}>
    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">{label}</p>
    <p className={cn("text-sm font-semibold", isHighlight ? "text-neutral-900" : "text-gray-900")}>{value}</p>
    {subValue && <p className="text-[10px] text-neutral-600 mt-0.5 font-medium">{subValue}</p>}
  </div>
);

export const OMShipmentPackingSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader className="bg-muted/20 pb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </CardContent>
  </Card>
);

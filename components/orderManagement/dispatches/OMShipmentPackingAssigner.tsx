import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Box, Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { OMShipmentBox, OMBoxContent, OMShipmentHelpers } from "@/types/order-management";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PackingItem {
  itemId: string;
  itemName: string;
  dispatchQty: number;
}

interface OMShipmentPackingAssignerProps {
  items: PackingItem[];
  value: OMShipmentBox[];
  onChange: (value: OMShipmentBox[]) => void;
}

export const OMShipmentPackingAssigner: React.FC<OMShipmentPackingAssignerProps> = ({
  items,
  value,
  onChange,
}) => {
  const [isAddBoxOpen, setIsAddBoxOpen] = useState(false);
  const [newBox, setNewBox] = useState({
    length: 0,
    width: 0,
    height: 0,
    numberOfBoxes: 1,
  });

  // Calculate packed quantities for each item across all boxes
  const packedQuantities = items.reduce((acc, item) => {
    const totalPacked = value.reduce((sum, box) => {
      const content = box.contents.find(c => c.itemId === item.itemId);
      return sum + (content ? content.quantity * box.numberOfBoxes : 0);
    }, 0);
    acc[item.itemId] = totalPacked;
    return acc;
  }, {} as Record<string, number>);

  const handleAddBox = () => {
    if (newBox.length <= 0 || newBox.width <= 0 || newBox.height <= 0) {
      toast.error("Please enter valid dimensions");
      return;
    }
    
    const nextBoxNumber = value.length > 0 
      ? Math.max(...value.map(b => Number(b.boxNumber))) + 1 
      : 1;

    const newBoxEntry: OMShipmentBox = {
      boxId: `temp-${Date.now()}`,
      boxNumber: nextBoxNumber,
      length: newBox.length,
      width: newBox.width,
      height: newBox.height,
      numberOfBoxes: newBox.numberOfBoxes,
      contents: [],
    };

    onChange([...value, newBoxEntry]);
    setIsAddBoxOpen(false);
    setNewBox({ length: 0, width: 0, height: 0, numberOfBoxes: 1 });
  };

  const handleRemoveBox = (boxId: string) => {
    onChange(value.filter(b => b.boxId !== boxId));
  };

  const handleUpdateBoxContent = (boxId: string, itemId: string, quantityPerBox: number) => {
    const updatedValue = value.map(box => {
      if (box.boxId !== boxId) return box;

      const existingContentIndex = box.contents.findIndex(c => c.itemId === itemId);
      const item = items.find(i => i.itemId === itemId);
      
      if (!item) return box;

      const newContents = [...box.contents];
      
      if (quantityPerBox <= 0) {
        // Remove if quantity is 0 or less
        if (existingContentIndex > -1) newContents.splice(existingContentIndex, 1);
      } else {
        if (existingContentIndex > -1) {
          newContents[existingContentIndex] = { ...newContents[existingContentIndex], quantity: quantityPerBox };
        } else {
          newContents.push({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: quantityPerBox,
          });
        }
      }

      return { ...box, contents: newContents };
    });

    onChange(updatedValue);
  };

  const isFullyPacked = (itemId: string) => {
    const item = items.find(i => i.itemId === itemId);
    return item && packedQuantities[itemId] === item.dispatchQty;
  };

  const isOverPacked = (itemId: string) => {
    const item = items.find(i => i.itemId === itemId);
    return item && packedQuantities[itemId] > item.dispatchQty;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5 text-neutral-900" />
            Shipment Packing (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Group dispatched items into physical boxes/cartons
          </p>
        </div>
        <Dialog open={isAddBoxOpen} onOpenChange={setIsAddBoxOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="border-neutral-400 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Box Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Box Configuration</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Length (cm)</Label>
                <Input 
                  type="number" 
                  value={newBox.length || ""} 
                  onChange={e => setNewBox({...newBox, length: parseInt(e.target.value) || 0})}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Width (cm)</Label>
                <Input 
                  type="number" 
                  value={newBox.width || ""} 
                  onChange={e => setNewBox({...newBox, width: parseInt(e.target.value) || 0})}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input 
                  type="number" 
                  value={newBox.height || ""} 
                  onChange={e => setNewBox({...newBox, height: parseInt(e.target.value) || 0})}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Boxes</Label>
                <Input 
                  type="number" 
                  min="1"
                  value={newBox.numberOfBoxes || ""} 
                  onChange={e => setNewBox({...newBox, numberOfBoxes: parseInt(e.target.value) || 1})}
                  placeholder="1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBoxOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBox} className="bg-neutral-900 text-white hover:bg-neutral-800">Add Box</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Packing Status Tracker */}
        {items.some(i => i.dispatchQty > 0) && (
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider mb-3 block">Packing Coverage Tracker</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {items.filter(i => i.dispatchQty > 0).map(item => (
                <div key={item.itemId} className={cn(
                  "p-2 px-3 rounded-md border flex items-center justify-between bg-white shadow-sm transition-all",
                  isFullyPacked(item.itemId) ? "border-neutral-200 ring-1 ring-neutral-900/10" : 
                  isOverPacked(item.itemId) ? "border-red-100 ring-1 ring-red-500/10" : "border-border"
                )}>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate text-gray-900">{item.itemName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      <p className="text-[10px] text-muted-foreground">
                        Packed: <span className={cn(
                          "font-bold",
                          isOverPacked(item.itemId) ? "text-red-600" :
                          isFullyPacked(item.itemId) ? "text-neutral-900" : "text-gray-900"
                        )}>{packedQuantities[item.itemId]} / {item.dispatchQty}</span>
                      </p>
                    </div>
                  </div>
                  {isFullyPacked(item.itemId) ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-900 shrink-0 ml-2" />
                  ) : isOverPacked(item.itemId) ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 ml-2" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Box List */}
        <div className="space-y-6">
          {value.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
              <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-medium">No shipment boxes added yet.</p>
              <p className="text-xs text-muted-foreground/60">Define box sizes to assign dispatched items into them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {value.map((box) => (
                <Card key={box.boxId} className="border border-border/60 shadow-none overflow-hidden hover:border-neutral-300 transition-all duration-300">
                  <div className="bg-muted/30 px-4 py-2 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                       <Box className="h-4 w-4 text-neutral-900" />
                       <span className="text-sm font-semibold text-gray-900">Box Type: {box.boxNumber}</span>
                     </div>
                     <Badge variant="secondary" className="bg-white border text-[10px] font-mono leading-none py-1">
                      {box.length} × {box.width} × {box.height} cm
                     </Badge>
                     {box.numberOfBoxes > 1 && (
                       <Badge className="bg-neutral-900 text-white border-none text-[10px] px-2">
                        {box.numberOfBoxes} Units
                       </Badge>
                     )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveBox(box.boxId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/5">
                        <TableRow className="hover:bg-transparent border-b">
                          <TableHead className="h-9 px-4 text-[10px] uppercase font-bold text-muted-foreground">Item Name</TableHead>
                          <TableHead className="h-9 px-4 text-right text-[10px] uppercase font-bold text-muted-foreground w-[150px]">Qty Per Box</TableHead>
                          <TableHead className="h-9 px-4 text-right text-[10px] uppercase font-bold text-muted-foreground w-[120px]">Total Packed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.filter(i => i.dispatchQty > 0).map(item => {
                          const content = box.contents.find(c => c.itemId === item.itemId);
                          const qty = content?.quantity || 0;
                          return (
                            <TableRow key={item.itemId} className="hover:bg-muted/5 border-b last:border-0">
                              <TableCell className="py-2.5 px-4">
                                <p className="text-xs font-medium text-gray-900">{item.itemName}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Remaining: {item.dispatchQty - packedQuantities[item.itemId] + (qty * box.numberOfBoxes)}</p>
                              </TableCell>
                              <TableCell className="py-2.5 px-4 text-right">
                                <Input 
                                  type="number" 
                                  min="0"
                                  className="h-8 text-xs text-right w-24 ml-auto border-gray-200 focus-visible:ring-neutral-900"
                                  value={qty || ""}
                                  onChange={e => handleUpdateBoxContent(box.boxId, item.itemId, parseInt(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </TableCell>
                              <TableCell className="py-2.5 px-4 text-right text-xs font-bold text-neutral-900">
                                {qty * box.numberOfBoxes}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {box.contents.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground italic">
                              No items assigned to this box yet. Enter quantities to pack.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

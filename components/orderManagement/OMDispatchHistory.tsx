"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/utils";
import { OMDispatchOrder, OMDispatchOrderItem } from "@/types/order-management";

interface OMDispatchHistoryProps {
  dispatches: OMDispatchOrder[];
}

export function OMDispatchHistory({ dispatches }: OMDispatchHistoryProps) {
  if (!dispatches || dispatches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/20">
        No dispatch history found for this purchase order.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {dispatches.map((dispatch: OMDispatchOrder) => (
        <AccordionItem key={dispatch.id} value={dispatch.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-1 items-center justify-between text-left pr-4">
              <div className="flex items-center gap-4">
                <span className="font-bold">{dispatch.invoiceNumber}</span>
                <span className="text-muted-foreground text-sm">
                  {dispatch.invoiceDate
                    ? new Date(dispatch.invoiceDate).toLocaleDateString()
                    : "N/A"}
                </span>
                <Badge variant="outline">{formatStatus(dispatch.status)}</Badge>
              </div>
              <div className="text-sm font-medium">
                {dispatch.items?.reduce(
                  (sum: number, i: OMDispatchOrderItem) => sum + i.quantity,
                  0,
                )}{" "}
                Items
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispatch.items?.map((item: OMDispatchOrderItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product?.name ||
                          item.purchaseOrderItem?.product?.name ||
                          "Unknown Product"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.product?.sku ||
                          item.purchaseOrderItem?.product?.sku ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

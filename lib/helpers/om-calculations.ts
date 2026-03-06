/**
 * Helper functions for Order Management calculations
 */

export interface LineItemInput {
  rate: number;
  quantity: number;
  gstPercentage: number;
}

export interface POTotals {
  totalQuantity: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
}

/**
 * Calculates totals for a single line item
 */
export function calculateLineItem(
  rate: number,
  quantity: number,
  gstPercentage: number,
) {
  const amount = rate * quantity;
  const gstAmount = (amount * gstPercentage) / 100;
  const totalAmount = amount + gstAmount;

  return {
    amount,
    gstAmount,
    totalAmount,
  };
}

/**
 * Calculates aggregated totals for a Purchase Order
 */
export function calculatePOTotals(
  items: { rate: number; quantity: number; gstPercentage: number }[],
): POTotals {
  return items.reduce(
    (acc, item) => {
      const { amount, gstAmount, totalAmount } = calculateLineItem(
        item.rate,
        item.quantity,
        item.gstPercentage,
      );
      acc.totalQuantity += item.quantity;
      acc.subtotal += amount;
      acc.totalGst += gstAmount;
      acc.grandTotal += totalAmount;
      return acc;
    },
    { totalQuantity: 0, subtotal: 0, totalGst: 0, grandTotal: 0 },
  );
}

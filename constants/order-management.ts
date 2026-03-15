import { getDispatchStatusVisuals } from "@/types/order-management";

export const PO_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  PARTIALLY_DISPATCHED: "Partially Dispatched",
  FULLY_DISPATCHED: "Fully Dispatched",
  CLOSED: "Closed",
};

export const getPoStatusClass = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent";
    case "PARTIALLY_DISPATCHED":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent";
    case "FULLY_DISPATCHED":
      return "bg-green-100 text-green-800 hover:bg-green-100 border-transparent";
    case "CLOSED":
      return "bg-red-100 text-red-800 hover:bg-red-100 border-transparent";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent";
  }
};

export const getDispatchStatusClass = (status: string) => {
  return getDispatchStatusVisuals(status).color;
};

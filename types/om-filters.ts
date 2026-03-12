export type FilterType =
  | "select"
  | "searchable-select"
  | "date"
  | "date-range"
  | "text"
  | "number";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  disabled?: boolean;
  className?: string;
}

export interface OMFilterValues {
  [key: string]: string;
}

/**
 * Calculates the current financial year string in YY-YY format.
 * Financial year starts in April.
 * For example, if current date is March 2026, it returns "25-26".
 * If current date is April 2026, it returns "26-27".
 */
export function getFinancialYearString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed, April is 3

  let startYear, endYear;
  if (month < 3) {
    // Before April, we are in the previous financial year
    startYear = year - 1;
    endYear = year;
  } else {
    // From April onwards, we are in the new financial year
    startYear = year;
    endYear = year + 1;
  }

  // Get last two digits of the years
  const startYY = String(startYear).slice(-2);
  const endYY = String(endYear).slice(-2);

  return `${startYY}-${endYY}`;
}

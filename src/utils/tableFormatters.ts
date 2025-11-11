/**
 * Table-specific formatting helpers.
 */
export const formatTableDate = (
  dateValue: string | Date | null | undefined,
): string => {
  if (!dateValue) {
    return "—";
  }

  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  return `${day}-${month}-${year}`;
};


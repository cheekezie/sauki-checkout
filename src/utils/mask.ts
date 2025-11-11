export const maskPhoneNumber = (value: string): string => {
  if (!value) return "";
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length <= 6) return digitsOnly;
  const start = digitsOnly.slice(0, 4);
  const end = digitsOnly.slice(-2);
  const middle = "*".repeat(Math.max(0, digitsOnly.length - 6));
  return `${start}${middle}${end}`;
};

export default maskPhoneNumber;


